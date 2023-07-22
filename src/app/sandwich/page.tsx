import { DataFilterWrap } from "../../components/DataFilterWrap";
import { Header } from "../../components/Header";
import sandwichData from "./data.json";

export default function SandwichPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <Header title="2022" food="SANDWICH" />
      <DataFilterWrap data={sandwichData} />
    </div>
  );
}
