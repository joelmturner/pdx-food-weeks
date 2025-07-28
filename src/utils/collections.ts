import { getCollection } from "astro:content";
import { db, eq, list } from "astro:db";
import type { EventsItem, FoodItem, ListItem } from "types";
import { FOOD_TYPES } from "../constants";

export function getYearsFromData(data: number[]) {
  const uniqueYears = new Set(data);
  return Array.from(uniqueYears);
}

export async function getYearsFromAllEvents(): Promise<
  {
    name: string;
    slug: string;
    years: number[];
  }[]
> {
  const foodCollection = await getCollection("food");
  const items: { name: string; slug: string; years: number[] }[] = [];
  FOOD_TYPES.forEach(type => {
    const item = foodCollection.filter(item => item.id.split("/")[0] === type);
    items.push({
      name: type,
      slug: type,
      years: [
        ...new Set(item.flatMap(item => item.data.map(item => item.year))),
      ],
    });
  });

  return items;
}

export async function getYearsFromFoodType(
  type: FoodItem["type"]
): Promise<number[]> {
  const foodCollection = await getCollection("food");
  const item = foodCollection.find(item => item.id.split("/")[0] === type);
  return [...new Set(item?.data.map(item => item.year) || [])];
}

export async function getFoodItemById(
  id: string
): Promise<FoodItem | undefined> {
  const foodCollection = await getCollection("food");
  const item = foodCollection.find(item => item.id === id);
  return item?.data[0] as unknown as FoodItem;
}

export async function getFoodItemsByIds(ids: string[]): Promise<FoodItem[]> {
  const foodCollection = await getCollection("food");
  const items = foodCollection
    .filter(item => ids.includes(item.id))
    .flatMap(item => item.data);
  return items as unknown as FoodItem[];
}

export function getUniqueNeighborhoods(data: FoodItem[]): string[] {
  return [
    ...new Set(
      data
        .map(item => item.neighborhood)
        .flat()
        .filter(neighborhood => !!neighborhood) as string[]
    ),
  ];
}

export function getPaths(data: { year: number }[]) {
  const uniqueYears = new Set([...data.map(item => item.year)]);

  return Array.from(uniqueYears).map(year => {
    return {
      params: {
        year: year + "",
      },
    };
  });
}

export async function getLists(userId?: string) {
  return userId
    ? ((await db
        .select()
        .from(list)
        .where(eq(list.userId, userId))) as unknown as ListItem[])
    : null;
}

export async function getFoodItems(
  year: number,
  type: FoodItem["type"]
): Promise<FoodItem[]> {
  try {
    const module = await import(
      /* @vite-ignore */ `../content/food/${type}/${year}.json`
    );
    const items: FoodItem[] = module.default || module;

    const filteredItems = items.filter(
      item => item.year === year && item.type === type
    );
    return filteredItems as unknown as FoodItem[];
  } catch (error) {
    // fallback for production environments where import might fail
    console.warn(
      `Could not import food data for ${type}/${year}, returning empty array`
    );
    return [];
  }
}

export async function getEventDetails(
  year: number,
  type: EventsItem["type"]
): Promise<EventsItem> {
  const eventCollection = await getCollection("events");
  const items = eventCollection[0].data.filter(item => {
    return item.year === year && item.type === type;
  });
  return items[0] as unknown as EventsItem;
}

export async function getFoodItemsByTypeAndYear(
  foodType: string,
  year: string
): Promise<FoodItem[]> {
  const foodCollection = await getCollection("food");
  const items = foodCollection
    .filter(item => {
      // extract food type from file path (e.g., "burger/2025.json" -> "burger")
      const foodTypeFromPath = item.id.split("/")[0];
      // extract year from file path (e.g., "burger/2025.json" -> "2025")
      const yearFromPath = item.id.split("/")[1]?.split(".")[0];
      return foodTypeFromPath === foodType && yearFromPath === year;
    })
    .flatMap(item => item.data)
    .map(item => ({
      ...item,
      type: foodType as FoodItem["type"],
    })) as FoodItem[];

  return items;
}

export const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long", // full name of the month
  day: "numeric", // numeric day of the month
  timeZone: "UTC", // important to ensure correct day regardless of local timezone
});
