import { db, eq, list } from "astro:db";
import fs from "node:fs/promises";
import path from "node:path";
import type { EventsItem, FoodItem, ListItem } from "types";
import events from "../content/events/events.json";

export function getYearsFromData(data: number[]) {
  const uniqueYears = new Set(data);
  return Array.from(uniqueYears);
}

export async function getYearsFromFoodType(type: FoodItem["type"]) {
  try {
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    const files = await fs.readdir(
      path.join(currentDir, "../content/food", type)
    );
    const years = files.map(file => file.split(".")[0]);
    return getYearsFromData(years.map(year => Number(year)));
  } catch (error) {
    // fallback for production environments where filesystem access might be limited
    console.warn(`Could not read filesystem for ${type}, using fallback data`);

    // return known years based on the food type
    const fallbackYears: Record<FoodItem["type"], number[]> = {
      sandwich: [2022, 2024, 2025],
      nacho: [2019, 2023, 2025],
      burger: [2019, 2023, 2024, 2025],
      pizza: [2024, 2025],
      wing: [2024],
      taco: [2025],
    };

    return fallbackYears[type] || [];
  }
}

export async function getFoodItemById(
  id: string
): Promise<FoodItem | undefined> {
  try {
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    // we need to look through the content of the json files in the food directory and find the item that contains the id
    const foodTypeDirectories = await fs.readdir(
      path.join(currentDir, "../content/food")
    ); // returns a list of the food type directories
    const items = await Promise.all(
      foodTypeDirectories.map(async foodTypeDirectory => {
        const files = await fs.readdir(
          path.join(currentDir, "../content/food", foodTypeDirectory)
        );
        const items = await Promise.all(
          files.map(async file => {
            const module = await import(
              /* @vite-ignore */ `../content/food/${foodTypeDirectory}/${file}`
            );
            return module.default.find(
              (item: FoodItem) => item.id === id
            ) as unknown as FoodItem;
          })
        );
        return items.find(item => item !== undefined);
      })
    );
    return items.find(item => item !== undefined);
  } catch (error) {
    // fallback for production environments where filesystem access might be limited
    console.warn(
      `Could not read filesystem for getFoodItemById, returning undefined`
    );
    return undefined;
  }
}

export async function getFoodItemsByIds(ids: string[]): Promise<FoodItem[]> {
  const items = await Promise.all(ids.map(id => getFoodItemById(id)));
  return items.filter(item => item !== undefined);
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

export async function getEventDetails(year: number, type: EventsItem["type"]) {
  return events.find(
    event => event.year === year && event.type === type
  ) as unknown as EventsItem;
}

export const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long", // full name of the month
  day: "numeric", // numeric day of the month
  timeZone: "UTC", // important to ensure correct day regardless of local timezone
});
