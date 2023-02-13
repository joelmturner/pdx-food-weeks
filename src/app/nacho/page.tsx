import { DataFilterWrap } from "../../components/DataFilterWrap";
import { Header } from "../../components/Header";
import nachoData from "./data.json";

export default function NachoPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <Header title="PDX Nacho Week" />
      <DataFilterWrap data={nachoData} />
    </div>
  );
}
