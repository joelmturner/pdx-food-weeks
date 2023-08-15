import { css } from "@/styled-system/css";
import { DataFilterWrap } from "@/components/DataFilterWrap";
import { Header } from "@/components/Header";
import { getUniqueNeighborhoods } from "@/utilities";
import nachoData from "./data.json";
import { Metadata } from "next";

export default function NachoPage() {
  const neighborhoods = getUniqueNeighborhoods(nachoData);

  return (
    <div
      className={css({ display: "flex", flexDir: "column", gap: "5", p: "6" })}
    >
      <Header title="2023" food="NACHOS" neighborhoods={neighborhoods} />
      <DataFilterWrap data={nachoData} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "PDX Nacho Week 2023",
};
