import { and, db, eq, list } from "astro:db";
import type { EventsItem, FoodItem, ListItem } from "types";
import food from "../content/food/food.json";
import events from "../content/events/events.json";

export function getYearsFromData(data: string[]) {
  const uniqueYears = new Set(data);
  return Array.from(uniqueYears);
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
  year: string,
  type: FoodItem["type"]
): Promise<FoodItem[]> {
  const items = food;
  const filteredItems = items.filter(
    item => item.year === year && item.type === type
  );
  return filteredItems as unknown as FoodItem[];
}

export async function getEventDetails(year: string, type: EventsItem["type"]) {
  return events.find(
    event => event.year === year && event.type === type
  ) as unknown as EventsItem;
}

export const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long", // full name of the month
  day: "numeric", // numeric day of the month
  timeZone: "UTC", // important to ensure correct day regardless of local timezone
});
