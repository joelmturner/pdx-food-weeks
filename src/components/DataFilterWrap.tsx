"use client";

import { useMemo } from "react";
import _intersection from "lodash/intersection";
import { useFilter } from "../app/filterProvider";
import { CardGrid } from "./CardGrid";
import { CardData } from "../types";

export function DataFilterWrap({ data }: { data: CardData[] }) {
  const [activeFilters] = useFilter();

  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (
        activeFilters.dietary.length === 0 &&
        activeFilters.neighborhoods.length === 0
      ) {
        return true;
      }

      const overlapDietary = _intersection(item.diet, activeFilters.dietary);
      const overlapNeighborhoods = _intersection(
        item.neighborhood.map(neighborhood => neighborhood.toLowerCase()),
        activeFilters.neighborhoods
      );

      return (
        (overlapDietary.length || !activeFilters.dietary.length) &&
        (overlapNeighborhoods.length || !activeFilters.neighborhoods.length)
      );
    });
  }, [activeFilters, data]);

  return <CardGrid data={filteredData} />;
}
