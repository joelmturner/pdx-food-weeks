import { load } from "cheerio";
import axios from "axios";
import type { APIContext } from "astro";

let cache: any = null;

const fetchData = async (url: string) => {
  const result = await axios.get(url);
  return load(result.data);
};

function getValue($: any, key: string) {
  return $("strong")
    .filter(function (this: any) {
      return $(this).text().trim() === key;
    })
    .next()
    .text()
    .trim();
}

const getPages = async (eventUrls: string[]) => {
  const events = eventUrls.map(async function (url) {
    const $ = await fetchData(url);
    const vegan = getValue($, "Vegan Substitute?");
    const vegetarian = getValue($, "Vegetarian Substitute?");
    const dietary = getValue($, "Meat or Vegetarian?");
    const ingredients = getValue($, "What's On It:");
    const hours = getValue($, "Where and When to Get It:");

    const diet = [
      ...new Set(
        [
          vegan === "Yes" ? "vegan" : undefined,
          vegetarian === "Yes" ? "vegetarian" : undefined,
          dietary?.toLowerCase(),
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
      description: ingredients,
      hours,
      imageUrl: $(".item-image img").attr("src") ?? null,
      diet,
    };
  });

  return await Promise.all(events);
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
  const types = ["sandwich", "nacho", "burger", "pizza"];
  // check which type the title contains
  const type = types.find(type => title.toLowerCase().includes(type));
  return { title, dateStart, dateEnd, url, description, year, type };
}

const getEventUrls = async (baseUrl: string) => {
  const $ = await fetchData(baseUrl);

  const eventUrls: string[] = [];

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
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  const data = await context.request.json();
  const baseUrl = data.url;

  if (cache) {
    console.log("Using cached data");
    return new Response(JSON.stringify(cache));
  }
  const eventDetails = await getEventDetails(baseUrl);
  const urls = await getEventUrls(baseUrl);
  const eventData = await getPages(urls);

  cache = { eventDetails, food: eventData };
  return new Response(JSON.stringify(eventData));
}
