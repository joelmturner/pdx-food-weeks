import { load } from "cheerio";
import axios from "axios";
import type { APIContext } from "astro";
import { FOOD_TYPES } from "../../constants";

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

function getValue($: any, key: string): string | null {
  // First try the specific structure we know about
  let questionElement = $(".answer.row .question-text").filter(function (
    this: any
  ) {
    const text = $(this).text().trim();
    // Normalize the text by removing extra spaces and special characters
    const normalizedText = text
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[^\w\s]/g, "");

    const normalizedKey = key
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[^\w\s]/g, "");

    return (
      normalizedText.includes(normalizedKey) ||
      normalizedKey.includes(normalizedKey)
    );
  });

  // If we don't find it, try a broader search
  if (questionElement.length === 0) {
    questionElement = $(".question-text").filter(function (this: any) {
      const text = $(this).text().trim();
      const normalizedText = text
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[^\w\s]/g, "");
      const normalizedKey = key
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[^\w\s]/g, "");
      return (
        normalizedText.includes(normalizedKey) ||
        normalizedKey.includes(normalizedText)
      );
    });
  }

  // If we still don't find it, try the description structure
  if (questionElement.length === 0) {
    const descriptionText = $(".description").text();
    // split on capital letters not after a space, then add a space before each capital letter
    // this accounts for things like "Meat or Vegetarian? VeganOther"
    const descriptionTextSplit = descriptionText.split(/(?=[A-Z])/);
    const descriptionTextSplitWithSpace = descriptionTextSplit.map(
      (item: string) => item.trim()
    );
    const descriptionTextSplitWithSpaceJoined =
      descriptionTextSplitWithSpace.join(" ");
    if (descriptionText.includes(key)) {
      // Find the text after the key
      const regex = new RegExp(
        `${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*([^\\n\\r]*?)(?=\\n|\\r|$|\\w+\\?|\\w+\\s*:)`,
        "i"
      );
      const match = descriptionTextSplitWithSpaceJoined.match(regex);

      if (match && match[1]) {
        return match[1].trim();
      }
    }
  }

  // Get the parent div with class 'answer row' and then find the answer-text div within it
  const answerElement = questionElement
    .closest(".answer.row")
    .find(".answer-text");

  // Get the text from the answer element
  const output = answerElement.text().trim();

  return output || null;
}

function sanitizeString(str: string) {
  if (!str) return "";
  return str
    .replaceAll("–", "-")
    .replaceAll("’", "'")
    .replaceAll(" ", " ")
    .replaceAll("‘", "'");
}

const getPages = async (eventUrls: string[]) => {
  const events = eventUrls.map(async function (url) {
    const $ = await fetchData(url);

    const vegan =
      getValue($, "Vegan Substitute?") ||
      getValue($, "Available Vegan?") ||
      getValue($, "Available Vegetarian/Vegan?");
    const vegetarian =
      getValue($, "Vegetarian Substitute?") ||
      getValue($, "Available Vegetarian/Vegan?") ||
      getValue($, "Available Vegetarian?");
    const glutenFree =
      getValue($, "Available Gluten-Free?") || getValue($, "Gluten Free?");
    const dietary =
      getValue($, "Meat or Vegetarian?") ||
      getValue($, "Chicken or Vegetarian?") ||
      getValue($, "Meat or Vegetarian") ||
      getValue($, "Chicken or Vegetarian");

    const ingredients =
      getValue($, "What's On It") ||
      getValue($, "What's On Them") ||
      getValue($, "What's In It") ||
      getValue($, "What's On It...");

    const hours =
      getValue($, "Where and When to Get It:") ||
      getValue($, "Where and When To Get Them:") ||
      $(".date-summary > span").text().trim();

    const veganCheck = ["yes", "vegan"];
    const isVegan =
      (vegan && veganCheck.some(item => vegan.toLowerCase().includes(item))) ||
      (dietary && dietary.toLowerCase().trim() === "vegan");

    const vegetarianCheck = ["yes", "vegetarian"];
    const isVegetarian =
      (vegetarian &&
        vegetarianCheck.some(item =>
          vegetarian.toLowerCase().includes(item)
        )) ||
      (dietary && dietary.toLowerCase().trim() === "vegetarian");

    const glutenFreeCheck = ["yes", "gluten free", "available"];
    const isGlutenFree = glutenFree
      ? glutenFreeCheck.some(item => glutenFree.toLowerCase().includes(item))
      : false;

    // handle both single and multiple dietary options
    const dietaryOptions =
      dietary
        ?.toLowerCase()
        .split(",")
        .map((option: string) => option.trim()) || [];
    const dietaryResolved = dietaryOptions
      .map((option: string) => {
        const firstWord = option.split(" ")[0];
        return firstWord === "chicken" ? "meat" : firstWord;
      })
      .filter((option: string) =>
        ["meat", "vegetarian", "vegan"].includes(option)
      );

    const diet = [
      ...new Set(
        [
          isVegan ? "vegan" : undefined,
          isVegetarian ? "vegetarian" : undefined,
          isGlutenFree ? "gf" : undefined,
          ...dietaryResolved,
        ].filter(Boolean)
      ),
    ].filter(
      (dietType): dietType is string =>
        dietType !== undefined &&
        ["vegan", "vegetarian", "gf", "meat"].includes(dietType)
    );

    const rawNeighborhood =
      $(".location > span").text().replace("(Portland)", "")?.trim() ?? null;
    const neighborhood =
      !!rawNeighborhood && !rawNeighborhood.includes(",")
        ? [rawNeighborhood]
        : rawNeighborhood.split(",");

    const title = $("header > h1").text().trim();
    const location = $(".location > a").text().trim();
    const year = new Date().getFullYear();
    const mapUrl =
      $(".map iframe").attr("src")?.replace("/embed/v1/place", "") ?? null;
    return {
      id: `${sanitizeString(location)}-${sanitizeString(title)}-${year}`,
      title: sanitizeString(title),
      url,
      location: sanitizeString(location),
      locationUrl: $(".location > a").attr("href") ?? null,
      neighborhood,
      date: sanitizeString($(".date-summary > span").text().trim()),
      mapUrl,
      description: sanitizeString(ingredients ?? ""),
      hours: sanitizeString(hours ?? ""),
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
function parseDates(
  dateStr: string,
  year: number
): { dateStart: Date; dateEnd: Date } {
  const dateEndText = dateStr.split("through ")[1]; // Extracts "April 21"
  const dateEnd = new Date(`${dateEndText}, ${year}`); // Assumes the end date is within the current year

  // dateStart is dateEnd minus 7 days
  const dateStart = new Date(dateEnd);
  dateStart.setDate(dateStart.getDate() - 6);

  return { dateStart, dateEnd };
}

async function getEventDetails(baseUrl: string) {
  const $ = await fetchData(baseUrl);
  const title = $("header > h1").text().trim();
  const dateText = $(".date-summary > span").text().trim();
  const year = new Date().getFullYear();
  const { dateStart, dateEnd } = parseDates(dateText, year);
  const url = baseUrl;
  const description =
    $(".descriptions > .description").text().trim() ||
    getValue($, "What They Say About It:") ||
    getValue($, "What's In It:") ||
    getValue($, "What's On It:") ||
    getValue($, "What's On Them:") ||
    getValue($, "What's In It:") ||
    getValue($, "What's On It...");
  const mapUrl =
    $(".description.additional-details iframe").attr("src") ?? null;
  // check which type the title contains
  const type = FOOD_TYPES.find(type => title.toLowerCase().includes(type));
  return {
    title: sanitizeString(title),
    dateStart,
    dateEnd,
    url,
    description: sanitizeString(description ?? ""),
    year,
    type,
    mapUrl,
    ogImage: $(".item-detail.event img").attr("src") ?? null,
  };
}

const getEventUrls = async (baseUrl: string) => {
  const $ = await fetchData(baseUrl);

  const eventUrls: string[] = [];

  const extraUrlsToCheck: string[] = [];

  if ($(".descriptions additional-details h4 a").length > 0) {
    $(".descriptions additional-details h4 a").each(function (_, element) {
      extraUrlsToCheck.push($(element).attr("href") ?? "");
    });
  }

  if (extraUrlsToCheck.length > 0) {
    for (const url of extraUrlsToCheck) {
      const $ = await fetchData(url);
      $(".event.list-item .event-title a").each(function (_, element) {
        eventUrls.push($(element).attr("href") ?? "");
      });
    }
  }

  $(".item-detail.event > .row > .col > a").each(function (_, element) {
    eventUrls.push($(element).attr("href") ?? "");
  });
  return eventUrls;
};

/* 
    1. replace staticUrls with eventUrls
    2. update writeFile name
    3. node -e "import('./src/scripts/fetchData.mjs').then(module => { module.crawl(); })"
*/

function getEventType(url: string) {
  const type = FOOD_TYPES.find(type => url.toLowerCase().includes(type));
  return type;
}

export async function POST(context: APIContext): Promise<Response> {
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  const data = await context.request.json();
  console.log("data", data);
  const baseUrl = data.url;
  const type = data.type || getEventType(baseUrl);

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
  const fullData = eventData.reduce<
    Array<(typeof eventData)[0] & { type: string; year: number }>
  >((acc, item) => {
    acc.push({
      ...item,
      type: type as string,
      year: new Date().getFullYear(),
    });
    return acc;
  }, []);
  console.log("fullData", JSON.stringify(fullData, null, 2));
  console.log("eventDetails", JSON.stringify(eventDetails, null, 2));

  cache[baseUrl] = { eventDetails, food: fullData };
  return new Response(JSON.stringify(fullData));
}
