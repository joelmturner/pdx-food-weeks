import { load } from "cheerio";
import axios from "axios";
import fs from "fs";

const fetchData = async url => {
  const result = await axios.get(url);
  return load(result.data);
};

function extractValue(data, key) {
  try {
    const parsedData = JSON.parse(JSON.stringify(data));
    if (parsedData && typeof parsedData === "object" && key in parsedData) {
      return parsedData[key];
    } else {
      throw new Error(
        'Invalid data format or "Available Vegan" key not found.'
      );
    }
  } catch (error) {
    console.error("Error parsing data:", error.message);
    return null;
  }
}

function extractBooleanValue(data, key) {
  const regex = new RegExp(`${key}\\s*\\?\\s*(Yes|No)`);
  const match = data.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    console.error(`Error: "${key}" value not found in the data.`);
    return null;
  }
}

function extractMeatOrVegetarianValue(data) {
  const regex = /Meat or Vegetarian\? (Vegan|Vegetarian|Meat)/;
  const match = data.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    console.error('Error: "Meat or Vegetarian" value not found in the data.');
    return null;
  }
}

function extractIngredientsValue(data) {
  //   const regex = /What's On Them: (.+?)(?=\\n\\n)/;
  const regex = /What's On It: (.+?)(?=\\n\\n)/;
  const match = data.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    console.error('Error: "What\'s on them" value not found in the data.');
    return null;
  }
}

function getValue($, key) {
  return $("strong")
    .filter(function () {
      return $(this).text().trim() === key;
    })
    .next()
    .text()
    .trim();
}

const getPages = async eventUrls => {
  const events = eventUrls.map(async function (url) {
    const $ = await fetchData(url);

    // seems like pizza week has different structure
    // const data = $(".description > span").attr("data-sheets-value");
    // const vegan = extractBooleanValue(data, "Vegan Substitute");
    // const vegetarian = extractBooleanValue(data, "Vegetarian Substitute");
    // const dietary = extractMeatOrVegetarianValue(data);

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
      //   description: extractIngredientsValue(data),
      //   hours: $(".description p:nth-child(3)").text().trim(),
      imageUrl: $(".item-image img").attr("src") ?? null,
      diet,
    };
  });

  return await Promise.all(events);
};

const getEventUrls = async baseUrl => {
  const $ = await fetchData(baseUrl);
  const eventUrls = [];

  $(".item-detail.event > .row > .col > a").each(function (index, element) {
    eventUrls.push($(element).attr("href") ?? "");
  });
  return eventUrls;
};

function parseAddressHours(text) {
  const resolved = text
    .replace("Address/Hours of Availability: ", "")
    .split(" / ");

  return {
    address: resolved[0],
    hours: resolved[1],
  };
}

function processData(eventData) {
  const newData = [];
  eventData.forEach(result => {
    newData.push({
      ...result,
      ...parseAddressHours(result.times),
      ingredients:
        result.ingredients?.replace("What's on it?: ", "").trim() ?? "",
      description:
        result.description?.replace("The Inspiration: ", "").trim() ?? "",
      info: result.info.split("Meat or Vegetarian?")?.[1].trim() ?? "",
    });
  });
  return newData;
}

// for testing structure
const staticUrls = [
  "https://everout.com/portland/events/butchers-bolognese/e172841/",
];

/* 
    1. replace staticUrls with eventUrls
    2. update writeFile name
    3. node -e "import('./src/scripts/fetchData.mjs').then(module => { module.crawl(); })"
*/

export async function crawl() {
  const urls = await getEventUrls('https://everout.com/portland/events/the-portland-mercurys-pizza-week-2024/e170026/');
  const eventData = await getPages(urls);

  fs.writeFile("pizza2024.json", JSON.stringify(eventData), err => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("Event data saved to pizza2024.json");
    }
  });
}
