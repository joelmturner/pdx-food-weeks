import { css } from "../../../styled-system/css";
import { DataFilterWrap } from "../../../components/DataFilterWrap";
import { Header } from "../../../components/Header";
import nachoData from "./data.json";

export default function NachoPage() {
  return (
    <div
      className={css({ display: "flex", flexDir: "column", gap: "5", p: "6" })}
    >
      <Header title="2019" food="NACHOS" />
      <DataFilterWrap data={nachoData} />
    </div>
  );
}
