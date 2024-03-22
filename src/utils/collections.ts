import type { CollectionEntry, DataEntryMap } from "astro:content";
import { Sandwiches, db } from "astro:db";

export function getYearsFromData(data: {year: number}[]) {
    const uniqueYears = new Set([...data.map(item => item.year)]);
    return Array.from(uniqueYears);
}
const foodItems = db.select().from(Sandwiches);
export function getUniqueNeighborhoods(data: ( Awaited<typeof foodItems>)[]): string[] {
    return [
      ...new Set(
        data
          .map(item => item.neighborhood)
          .flat()
          .filter(neighborhood => !!neighborhood)
      ),
    ];
  }
  
  export function getPaths(data: {year: number}[]) {
    const uniqueYears = new Set([...data.map(item => item.year)]);

  return Array.from(uniqueYears).map(year => {
    return {
      params: {
        year: year + "",
      },
    };
  });
  }