import { load } from "cheerio";
import axios from "axios";

const baseUrl =
  "https://everout.com/portland/events/the-portland-mercurys-nacho-week-2023/e150488/";

const fetchData = async url => {
  const result = await axios.get(url);
  return load(result.data);
};

// function parsePizzaInfo(rawText: string): PizzaInfo | null {
//   const text = rawText
//     .replace(/[\u2018\u2019]/g, "'")
//     .replace(/[\u201C\u201D]/g, '"')
//     .replace(/–/g, "-");

//   const nameRegex = /What It's Called: (.*?)(?:\s* \s*)/;
//   const ingredientsRegex = /What's On It: (.*?)(?:\s* \s*)/;
//   const descriptionRegex = /What They Say About It: (.*?)(?:\s* \s*)/;
//   const locationAndHoursRegex =
//     /Where and When to Get It: (.*?),\s*(.*?)(?:\s*\/\s*)(.*?)(?:\s* \s*)/;
//   const finePrintRegex =
//     /Meat or Vegetarian\? (.*?)\s* \s*By the Slice or Whole Pie\? (.*?)\s* \s*Allow Minors\? (.*?)\s* \s*Allow Takeout\? (.*?)\s* \s*Allow Delivery\? (.*?)\s* \s*Purchase Limit per Customer\? (.*?)\s* \s*Daily Availability Limit\? (.*?)(?:\s* \s*)/;
//   const moreDetailsRegex = /More Details: (.*?)(?:\s* \s*)/;

//   const nameMatch = text.match(nameRegex);
//   const ingredientsMatch = text.match(ingredientsRegex);
//   const descriptionMatch = text.match(descriptionRegex);
//   const locationAndHoursMatch = text.match(locationAndHoursRegex);
//   const finePrintMatch = text.match(finePrintRegex);
//   const moreDetailsMatch = text.match(moreDetailsRegex);

//   console.log({
//     nameMatch,
//     ingredientsMatch,
//     descriptionMatch,
//     locationAndHoursMatch,
//     finePrintMatch,
//     moreDetailsMatch,
//   });

//   if (
//     !nameMatch ||
//     !ingredientsMatch ||
//     !descriptionMatch ||
//     !locationAndHoursMatch ||
//     !finePrintMatch ||
//     !moreDetailsMatch
//   ) {
//     return null;
//   }

//   const dailyAvailabilityLimitMatch = finePrintMatch[7].match(/Yes(\d+)/);
//   const dailyAvailabilityLimit = dailyAvailabilityLimitMatch
//     ? parseInt(dailyAvailabilityLimitMatch[1])
//     : null;

//   const pizzaInfo: PizzaInfo = {
//     name: nameMatch[1],
//     ingredients: ingredientsMatch[1],
//     description: descriptionMatch[1],
//     location: locationAndHoursMatch[1],
//     hours: locationAndHoursMatch[2],
//     address: locationAndHoursMatch[3],
//     meatOrVegetarian: finePrintMatch[1],
//     sliceOrWholePie: finePrintMatch[2],
//     allowMinors: finePrintMatch[3] === "Yes",
//     allowTakeout: finePrintMatch[4] === "Yes",
//     allowDelivery: finePrintMatch[5] === "Yes",
//     purchaseLimit: finePrintMatch[6],
//     dailyAvailabilityLimit: dailyAvailabilityLimit,
//     moreDetails: moreDetailsMatch[1],
//   };

//   return pizzaInfo;
// }
// interface ParsedInfo {
//   [key: string]: string | number | boolean | null;
// }

// function parseDynamicInfo(text: string): ParsedInfo | null {
//   const infoRegex = /(?:\r?\n|^)([^:\r\n]+):\s*(.*?)(?:\s* \s*|$)/g;

//   const parsedInfo: ParsedInfo = {};

//   let match: RegExpExecArray | null;

//   while ((match = infoRegex.exec(text)) !== null) {
//     const key = match[1].replace(/\s+/g, " ");
//     const value = match[2].replace(/\s+/g, " ");

//     if (/^(Yes|No)$/.test(value)) {
//       parsedInfo[key] = value === "Yes";
//     } else if (/^Yes\d+$/.test(value)) {
//       const numberMatch = value.match(/(\d+)/);
//       parsedInfo[key] = numberMatch ? parseInt(numberMatch[1]) : null;
//     } else {
//       parsedInfo[key] = value;
//     }
//   }

//   return Object.keys(parsedInfo).length > 0 ? parsedInfo : null;
// }
// type Pizza = {
//   id: number;
//   name: string;
//   venue: string;
//   neighborhood: string;
//   ingredients: string;
//   description: string;
//   times: string;
//   info: string;
// };

function parsePizza(rawText, id) {
  const text = rawText
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/–/g, "-");

  const sectionsMapping = {
    "What It's Called": "name",
    "What's On It": "ingredients",
    "What They Say About It": "description",
    "Where and When to Get It": "times",
    "Meat or Vegetarian?": "info",
  };

  const pizza = {
    id,
  };

  for (const key in sectionsMapping) {
    const regex = new RegExp(`${key}:(.*?)\\s* \\s*`, "s");
    const match = text.match(regex);

    if (!match) {
      return null;
    }

    const value = match[1].trim().replace(/\s+/g, " ");
    pizza[sectionsMapping[key]] = value;
  }

  // Extract venue and neighborhood from "times" property
  const venueAndNeighborhoodRegex = /(.*?),\s*(.*?)\s*(?=\d)/;
  const venueAndNeighborhoodMatch = pizza.times.match(
    venueAndNeighborhoodRegex
  );

  if (!venueAndNeighborhoodMatch) {
    return null;
  }

  pizza.venue = venueAndNeighborhoodMatch[1];
  pizza.neighborhood = venueAndNeighborhoodMatch[2];

  return pizza;
}

// const parsedInfo = parsePizzaInfo(text);

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
  const regex = /What's On Them: (.+?)(?=\\n\\n)/;
  const match = data.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    console.error('Error: "What\'s on them" value not found in the data.');
    return null;
  }
}

const getPages = async eventUrls => {
  const events = eventUrls.map(async function (url, index) {
    const $ = await fetchData(url);
    const data = $(".description > span").attr("data-sheets-value");
    const vegan = extractBooleanValue(data, "Available Vegan");
    const vegetarian = extractBooleanValue(data, "Available Vegetarian");
    const dietary = extractMeatOrVegetarianValue(data);
    const diet = [
      ...new Set(
        [
          vegan === "Yes" ? "vegan" : undefined,
          vegetarian === "Yes" ? "vegetarian" : undefined,
          dietary.toLowerCase(),
        ].filter(Boolean)
      ),
    ];
    const rawNeighborhood =
      $(".location > span").text().replace("(Portland)", "")?.trim() ?? null;
    const neighborhood =
      !!rawNeighborhood && !rawNeighborhood.includes(",")
        ? [rawNeighborhood]
        : rawNeighborhood.split(",");
    return {
      id: `${index}`,
      title: $("header > h1").text().trim(),
      url,
      location: $(".location > a").text().trim(),
      locationUrl: $(".location > a").attr("href") ?? null,
      neighborhood,
      date: $(".date-summary > span").text().trim(),
      mapUrl: $(".map .google-maps-link > a").attr("href") ?? null,
      description: extractIngredientsValue(data),
      hours: $(".description p:nth-child(3)").text().trim(),
      imageUrl: $(".item-image img").attr("src") ?? null,
      diet,
    };
  });

  return await Promise.all(events);
};

const getEventUrls = async () => {
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

const staticUrls = [
  "https://everout.com/portland/events/beef-birria-nachos/e150499/",
  "https://everout.com/portland/events/fiesta-nachos/e150495/",
  "https://everout.com/portland/events/stout-chos/e150501/",
  "https://everout.com/portland/events/boke-nacho/e150500/",
  "https://everout.com/portland/events/nacho-average-nachos/e150494/",
  "https://everout.com/portland/events/zesty-fiesta-nacho/e150491/",
  "https://everout.com/portland/events/kalua-pork-nachos/e150608/",
  "https://everout.com/portland/events/fuego-bacon-nachos/e150496/",
  "https://everout.com/portland/events/nachos-colorado/e150613/",
  "https://everout.com/portland/events/crispy-pork-belly-nachos/e150498/",
  "https://everout.com/portland/events/beef-birria-nachos/e150502/",
  "https://everout.com/portland/events/sriracha-candied-bacon-nachos/e150603/",
  "https://everout.com/portland/events/da-kalua-nacho-bomb/e150600/",
  "https://everout.com/portland/events/chicharonasos/e150685/",
  "https://everout.com/portland/events/philly-cheese-nachos/e150796/",
  "https://everout.com/portland/events/chicken-poblano-nacho/e150493/",
  "https://everout.com/portland/events/gochu-nacho/e150610/",
  "https://everout.com/portland/events/guajillo-braised-pork-nacho/e150492/",
  "https://everout.com/portland/events/nachos-vulcan/e150497/",
  "https://everout.com/portland/events/ridin-ranchero-nachos/e150490/",
  "https://everout.com/portland/events/green-chile-nachos/e150602/",
  "https://everout.com/portland/events/bichita-nachos/e150612/",
  "https://everout.com/portland/events/bulgogi-beef-nachos/e150489/",
  "https://everout.com/portland/events/noho-nacho/e150609/",
  "https://everout.com/portland/events/tinga-bout-it/e150605/",
  "https://everout.com/portland/events/todo-nachos/e150601/",
  "https://everout.com/portland/events/nachos-supreme/e150611/",
  "https://everout.com/portland/events/lime-chicken-nachos/e150604/",
  "https://everout.com/portland/events/el-pastor-marinated-pollo/e150606/",
];

export async function crawl() {
  //   const eventUrls = await getEventUrls();
  //   console.log("eventUrls", eventUrls);
  const eventData = await getPages(staticUrls);
  console.dir({ eventData }, { depth: null });
  //   const data = processData(eventData);
  //   console.dir({ eventData }, { depth: null });
  return { happy: "yup" };
}

crawl();

// const boom =
//   "Allow Minors? YesAllow Takeout? NoAllow Delivery? NoPurchase Limit? NoMeat or Vegetarian? Vegan";
// const newboom = boom.split("Meat or Vegetarian?")?.[1].trim();
// console.log("newboom", newboom);
