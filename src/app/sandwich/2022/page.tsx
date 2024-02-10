import { css } from "@/styled-system/css";
import { DataFilterWrap } from "@/components/DataFilterWrap";
import { Header } from "@/components/Header";
import sandwichData from "./data.json";
import { Metadata } from "next";

export default function SandwichPage() {
  return (
    <div
      className={css({ display: "flex", flexDir: "column", gap: "5", p: "6" })}
    >
      <Header title="2022" food="SANDWICH" />
      <DataFilterWrap data={sandwichData} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "PDX Sandwich Week",
  description: "Fan site for PDX sandwich week",
};
