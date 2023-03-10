import burgerData from "./data.json";
import { DataFilterWrap } from "../../components/DataFilterWrap";
import { Header } from "../../components/Header";

export default function BurgerPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <Header title="PDX Burger Week" />
      <DataFilterWrap data={burgerData} />
    </div>
  );
}
