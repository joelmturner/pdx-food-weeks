import { DataFilterWrap } from "../../../components/DataFilterWrap";
import { Header } from "../../../components/Header";
import { getUniqueNeighborhoods } from "../../../utilities";
import nachoData from "./data.json";

export default function NachoPage() {
  const neighborhoods = getUniqueNeighborhoods(nachoData);

  return (
    <div className="flex flex-col gap-5 p-6">
      <Header title="2023" food="NACHOS" neighborhoods={neighborhoods} />
      <DataFilterWrap data={nachoData} />
    </div>
  );
}
