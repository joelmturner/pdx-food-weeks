import type { FoodItem } from "types";

export function getYearsFromData(data: {year: number}[]) {
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