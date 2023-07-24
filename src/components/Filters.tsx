import { css } from "../styled-system/css";
import { FilterSet } from "./FilterSet";

export function Filters({ neighborhoods }: { neighborhoods?: string[] }) {
  return (
    <div className={css({ display: "flex", flexDir: "column", gap: "8" })}>
      <FilterSet key="dietary" filterKey="dietary" />
      <FilterSet
        key="neighborhoods"
        filterKey="neighborhoods"
        neighborhoods={neighborhoods}
      />
    </div>
  );
}
