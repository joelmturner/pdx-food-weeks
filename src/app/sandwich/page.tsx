import { DataFilterWrap } from "../../components/DataFilterWrap";
import { Filters } from "../../components/Filters";
import sandwichData from "./data.json";

export default function SandwichPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex justify-between align-middle">
        <h2 className="text-2xl font-bold">PDX Sandwich Week</h2>
        <Filters />
      </div>

      <DataFilterWrap data={sandwichData} />
    </div>
  );
}
