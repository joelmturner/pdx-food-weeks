"use client";

import { css } from "../styled-system/css";
import { useFilter } from "../app/filterProvider";
import { Badge } from "./Badge";

const KEY_VS_FILTER_SET = {
  dietary: ["vegan", "vegetarian", "gf"],
  neighborhoods: ["north", "northwest", "northeast", "southeast", "downtown"],
};

export function FilterSet({
  filterKey,
  dietary = KEY_VS_FILTER_SET.dietary,
  neighborhoods = KEY_VS_FILTER_SET.neighborhoods,
}: {
  filterKey: "dietary" | "neighborhoods";
  dietary?: string[];
  neighborhoods?: string[];
}) {
  const [activeFilters, dispatch] = useFilter();
  const filters = filterKey === "neighborhoods" ? neighborhoods : dietary;

  return (
    <div
      className={css({
        display: "flex",
        gap: "2",
        justifyContent: "flex-end",
        flexWrap: "wrap",
      })}
    >
      <div className="inline-flex items-center justify-center transition duration-200 ease-in-out h-5 text-sm leading-5"></div>
      {filters.map(item => (
        <Badge
          key={item}
          active={activeFilters[filterKey].includes(item.toLowerCase())}
          onClick={() =>
            dispatch({ type: filterKey, value: item.toLowerCase() })
          }
        >
          {item.toUpperCase()}
        </Badge>
      ))}
      <Badge
        key={"close"}
        active={!!activeFilters[filterKey].length}
        onClick={() => dispatch({ type: filterKey, value: null })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className={css({
            display: "inline-block",
            w: "4",
            h: "4",
            stroke: "current",
            cursor: "pointer",
          })}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </Badge>
    </div>
  );
}
