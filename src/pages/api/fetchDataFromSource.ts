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
  const urls = await getEventUrls(baseUrl);
  const eventData = await getPages(urls);

  cache = eventData;
  return new Response(JSON.stringify(eventData));
}
