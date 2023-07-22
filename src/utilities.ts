import { CardData } from "./types";

export function getUniqueNeighborhoods(data: CardData[]): string[] {
  return [
    ...new Set(
      data
        .map(item => item.neighborhood)
        .flat()
        .filter(neighborhood => !!neighborhood)
    ),
  ];
}
