import { Food, and, db, eq, list } from "astro:db";
import type { FoodItem, ListItem } from "types";

export function getYearsFromData(data: { year: number }[]) {
  const uniqueYears = new Set([...data.map(item => item.year)]);
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
  return (await db
    .select()
    .from(Food)
    .where(
      and(eq(Food.year, parseInt(year)), eq(Food.type, type))
    )) as unknown as FoodItem[];
}
