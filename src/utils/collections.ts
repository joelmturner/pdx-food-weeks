import type { CollectionEntry, DataEntryMap } from "astro:content";

export function getYearsFromData<T extends keyof DataEntryMap>(data: CollectionEntry<T>[]) {
    return data.map(entry => entry.id);
}

export function getUniqueNeighborhoods<T extends keyof DataEntryMap>(data: CollectionEntry<T>['data']): string[] {
    return [
      ...new Set(
        data
          .map(item => item.neighborhood)
          .flat()
          .filter(neighborhood => !!neighborhood)
      ),
    ];
  }
  