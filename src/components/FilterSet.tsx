"use client";

import { useFilter } from "../app/filterProvider";

const KEY_VS_FILTER_SET = {
  dietary: ["vegan", "vegetarian", "gf"],
  neighborhoods: ["north", "northwest", "northeast", "southeast", "downtown"],
};

export function FilterSet({
  filterKey,
}: {
  filterKey: "dietary" | "neighborhoods";
}) {
  const [activeFilters, dispatch] = useFilter();

  return (
    <div className="flex gap-2 justify-end">
      {KEY_VS_FILTER_SET[filterKey].map(item => (
        <div
          key={item}
          className={`badge badge-lg cursor-pointer ${
            activeFilters[filterKey].includes(item)
              ? "bg-neutral-content text-base-100"
              : "badge-neutral"
          }`}
          onClick={() => dispatch({ type: filterKey, value: item })}
        >
          {item.toUpperCase()}
        </div>
      ))}
      <div
        className={`badge badge-lg cursor-pointer ${
          activeFilters[filterKey].length ? "bg-secondary-focus" : ""
        }`}
        onClick={() => dispatch({ type: filterKey, value: null })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-4 h-4 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </div>
    </div>
  );
}
