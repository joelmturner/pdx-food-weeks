import { load } from "cheerio";
import axios from "axios";
import type { APIContext } from "astro";

let cache: any = null;

const fetchData = async (url: string) => {
  const result = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Cache-Control": "max-age=0",
    },
  });
  return load(result.data);
};

function getValue($: any, key: string) {
  const output = $("strong")
    .filter(function (this: any) {
      return $(this).text().trim() === key;
    })
    .next()
    .text()
    .trim();

  return !!output ? output : null;
}

const getPages = async (eventUrls: string[]) => {
  const events = eventUrls.map(async function (url) {
    const $ = await fetchData(url);

    const vegan =
      getValue($, "Vegan Substitute?") ||
      getValue($, "Available Vegetarian/Vegan?");
    const vegetarian =
      getValue($, "Vegetarian Substitute?") ||
      getValue($, "Available Vegetarian/Vegan?");
    const glutenFree = getValue($, "Available Gluten-Free?");
    const dietary =
      getValue($, "Meat or Vegetarian?") ||
      getValue($, "Chicken or Vegetarian?");
    const ingredients =
      getValue($, "What's On It:") || getValue($, "What's On Them:");
    const hours =
      getValue($, "Where and When to Get It:") ||
      getValue($, "Where and When To Get Them:");

    const veganCheck = ["yes", "vegan"];

    const isVegan = vegan
      ? veganCheck.some(item => vegan.toLowerCase().includes(item)) ||
        veganCheck.some(item => dietary.toLowerCase().includes(item))
      : false;

    const vegetarianCheck = ["yes", "vegetarian"];
    const isVegetarian = vegetarian
      ? vegetarianCheck.some(item => vegetarian.toLowerCase().includes(item)) ||
        vegetarianCheck.some(item => dietary.toLowerCase().includes(item))
      : false;

    const dietaryItem = dietary?.toLowerCase().split(" ")[0];
    const dietaryResolved = dietaryItem === "chicken" ? "meat" : dietaryItem;

    const diet = [
      ...new Set(
        [
          isVegan ? "vegan" : undefined,
          isVegetarian ? "vegetarian" : undefined,
          glutenFree === "Yes" ? "gf" : undefined,
          dietaryResolved,
        ].filter(Boolean)
      ),
    ];

    const rawNeighborhood =
      $(".location > span").text().replace("(Portland)", "")?.trim() ?? null;
    const neighborhood =
      !!rawNeighborhood && !rawNeighborhood.includes(",")
        ? [rawNeighborhood]
        : rawNeighborhood.split(",");

    const title = $("header > h1").text().trim();
    const location = $(".location > a").text().trim();
    return {
      id: `${location}-${title}`,
      title,
      url,
      location,
      locationUrl: $(".location > a").attr("href") ?? null,
      neighborhood,
      date: $(".date-summary > span").text().trim(),
      mapUrl: $(".map .google-maps-link > a").attr("href") ?? null,
      description: ingredients ?? "",
      hours: hours ?? "",
      imageUrl: $(".item-image img").attr("src") ?? null,
      diet,
    };
  });

  const eventData = await Promise.all(events);
  return Array.from(
    new Set([...eventData.sort((a, b) => a.location.localeCompare(b.title))])
  );
};

// Function to parse the date from the given text
function parseDates(dateStr: string): { dateStart: Date; dateEnd: Date } {
  const dateEndText = dateStr.split("through ")[1]; // Extracts "April 21"
  const currentYear = new Date().getFullYear(); // Gets the current year
  const dateEnd = new Date(`${dateEndText}, ${currentYear}`); // Assumes the end date is within the current year

  // dateStart is dateEnd minus 7 days
  const dateStart = new Date(dateEnd);
  dateStart.setDate(dateStart.getDate() - 6);

  return { dateStart, dateEnd };
}

async function getEventDetails(baseUrl: string) {
  const $ = await fetchData(baseUrl);
  const title = $("header > h1").text().trim();
  const dateText = $(".date-summary > span").text().trim();
  const { dateStart, dateEnd } = parseDates(dateText);
  const url = baseUrl;
  const description = $(".descriptions > .description").text().trim();
  const year = dateStart.getFullYear();
  const types = ["sandwich", "nacho", "burger", "pizza", "wing"];
  // check which type the title contains
  const type = types.find(type => title.toLowerCase().includes(type));
  return { title, dateStart, dateEnd, url, description, year, type };
}

const getEventUrls = async (baseUrl: string) => {
  const $ = await fetchData(baseUrl);

  const eventUrls: string[] = [];

  const extraUrlsToCheck: string[] = [];

  if ($(".descriptions additional-details h4 a").length > 0) {
    $(".descriptions additional-details h4 a").each(function (index, element) {
      extraUrlsToCheck.push($(element).attr("href") ?? "");
    });
  }

  if (extraUrlsToCheck.length > 0) {
    for (const url of extraUrlsToCheck) {
      const $ = await fetchData(url);
      $(".event.list-item .event-title a").each(function (index, element) {
        eventUrls.push($(element).attr("href") ?? "");
      });
    }
  }

  $(".item-detail.event > .row > .col > a").each(function (index, element) {
    eventUrls.push($(element).attr("href") ?? "");
  });
  return eventUrls;
};

/* 
    1. replace staticUrls with eventUrls
    2. update writeFile name
    3. node -e "import('./src/scripts/fetchData.mjs').then(module => { module.crawl(); })"
*/

export async function POST(context: APIContext): Promise<Response> {
  console.log("context.locals.session", context.locals.session);
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  const data = await context.request.json();
  console.log("data", data);
  const baseUrl = data.url;

  if (!cache) {
    cache = {};
  }
  if (cache[baseUrl]) {
    console.log("Using cached data");
    return new Response(JSON.stringify(cache[baseUrl]));
  }

  const eventDetails = await getEventDetails(baseUrl);
  const urls = await getEventUrls(baseUrl);
  const eventData = await getPages(urls);
  console.log("eventData", eventData);

  cache[baseUrl] = { eventDetails, food: eventData };
  return new Response(JSON.stringify(eventData));
}
