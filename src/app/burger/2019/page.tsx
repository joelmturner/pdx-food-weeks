import burgerData from "./data.json";
import { DataFilterWrap } from "@/components/DataFilterWrap";
import { Header } from "@/components/Header";
import { css } from "@/styled-system/css";
import { Metadata } from "next";

export default function BurgerPage() {
  return (
    <div
      className={css({ display: "flex", flexDir: "column", gap: "5", p: "6" })}
    >
      <Header title="2019" food="BURGER" />
      <DataFilterWrap data={burgerData} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "PDX Burger Week 2019",
};
