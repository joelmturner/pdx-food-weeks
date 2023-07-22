import { FilterSet } from "./FilterSet";

export function Filters({ neighborhoods }: { neighborhoods?: string[] }) {
  return (
    <div className="flex flex-col gap-8">
      <FilterSet key="dietary" filterKey="dietary" />
      <FilterSet
        key="neighborhoods"
        filterKey="neighborhoods"
        neighborhoods={neighborhoods}
      />
    </div>
  );
}
