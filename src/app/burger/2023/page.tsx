import burgerData from "./data.json";
import { DataFilterWrap } from "@/components/DataFilterWrap";
import { Header } from "@/components/Header";
import { css } from "@/styled-system/css";
import { getUniqueNeighborhoods } from "@/utilities";
import type { Metadata } from "next";

export default function BurgerPage() {
  const neighborhoods = getUniqueNeighborhoods(burgerData);
  return (
    <div
      className={css({ display: "flex", flexDir: "column", gap: "5", p: "6" })}
    >
      <Header
        title="2023"
        food="BURGER"
        subtitle="August 21 - August 27"
        neighborhoods={neighborhoods}
      />
      <DataFilterWrap data={burgerData} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "PDX Burger Week 2023",
};
