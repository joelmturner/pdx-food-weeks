import { load } from "cheerio";
import axios from "axios";
import fs from "fs";

const baseUrl =
  "https://everout.com/portland/events/the-portland-mercurys-nacho-week-2023/e150488/";

const fetchData = async (url) => {
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

const getPages = async (eventUrls) => {
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
  eventData.forEach((result) => {
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
  "https://everout.com/portland/events/abc-anthony-bourdain-classic/e168673/",
  "https://everout.com/portland/events/kimcheesesteak/e168676/",
  "https://everout.com/portland/events/chicken-katsu-banh-mi/e168668/",
  "https://everout.com/portland/events/star-anise-sloppy-joe/e168667/",
  "https://everout.com/portland/events/sweet-and-spicy-turkey-melt/e168453/",
  "https://everout.com/portland/events/smoked-chicken-gyro/e168648/",
  "https://everout.com/portland/events/korean-hot-chicken-sando/e168448/",
  "https://everout.com/portland/events/crispy-creole-chicken-sandwich/e168441/",
  "https://everout.com/portland/events/banh-melt/e168664/",
  "https://everout.com/portland/events/holy-schnitz/e168458/",
  "https://everout.com/portland/events/pepper-jack-rabbit/e168675/",
  "https://everout.com/portland/events/the-porky-pretzel/e168666/",
  "https://everout.com/portland/events/eighth-street-spiedie/e168449/",
  "https://everout.com/portland/events/two-brother-club/e168670/",
  "https://everout.com/portland/events/lemongrass-chicken-meatball-bahn-mi-sando/e168437/",
  "https://everout.com/portland/events/club-sandwich/e168455/",
  "https://everout.com/portland/events/open-face-danish-roast-beef-on-rye/e168461/",
  "https://everout.com/portland/events/gigantic-beef-n-cheddar/e168456/",
  "https://everout.com/portland/events/bbq-pulled-pork-sandwich-with-ipa-honey-mustard-slaw/e168674/",
  "https://everout.com/portland/events/portland-cubano/e168659/",
  "https://everout.com/portland/events/curry-chicken-salad-sando/e168663/",
  "https://everout.com/portland/events/new-jersey-hangover/e168440/",
  "https://everout.com/portland/events/slow-cooked-portuguese-cacoila/e168655/",
  "https://everout.com/portland/events/chopped-cheese-smashy-boi/e168452/",
  "https://everout.com/portland/events/for-schnitz-and-giggles/e168450/",
  "https://everout.com/portland/events/straight-outta-porkland/e168447/",
  "https://everout.com/portland/events/chicken-cordon-blue-sammy/e168650/",
  "https://everout.com/portland/events/pan-con-lechon/e168677/",
  "https://everout.com/portland/events/sausage-and-peppers/e168443/",
  "https://everout.com/portland/events/carolina-cool-arrow/e168438/",
  "https://everout.com/portland/events/slammin-sammys-texas-pork/e168665/",
  "https://everout.com/portland/events/braised-pork-chile-verde/e168646/",
  "https://everout.com/portland/events/baked-ziti-on-garlic-bread/e168661/",
  "https://everout.com/portland/events/ham-and-eggn/e168460/",
  "https://everout.com/portland/events/cali-katsu/e168439/",
  "https://everout.com/portland/events/smoked-pork-cracklin-sandwich/e168672/",
  "https://everout.com/portland/events/pesto-paradise/e168445/",
  "https://everout.com/portland/events/pastor-al/e168444/",
  "https://everout.com/portland/events/chickpea-curry-smash/e168446/",
  "https://everout.com/portland/events/italian-grilled-cheese/e168457/",
  "https://everout.com/portland/events/bahn-james-bahn/e168454/",
  "https://everout.com/portland/events/just-the-tip-with-the-fixings/e168451/",
  "https://everout.com/portland/events/the-iowa-pork-tenderloin/e168442/",
  "https://everout.com/portland/events/sujuk-sandwich/e168459/",
];

/* 
    1. replace staticUrls with eventUrls
    2. update writeFile name
    3. node -e "import('./src/fetchData.mjs').then(module => { module.crawl(); })"
*/

export async function crawl() {
  const eventData = await getPages(staticUrls);
  //   console.dir({ eventData }, { depth: null });
  // save eventData to a json file named sandwiches2024.json

  fs.writeFile("sandwiches2024.json", JSON.stringify(eventData), (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("Event data saved to sandwiches2024.json");
    }
  });
}
