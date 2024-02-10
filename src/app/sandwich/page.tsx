import Link from "next/link";
import { css } from "@/styled-system/css";
import { SANDWICH_YEARS } from "./constants";
import { Metadata } from "next";

export default function SandwichPage() {
  return (
    <ul
      className={css({
        display: "flex",
        flexDir: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "4",
        p: "2",
        w: "full",
        h: "full",
      })}
    >
      {SANDWICH_YEARS.map(year => (
        <li key={year} className={css({ fontSize: "5xl" })}>
          <Link href={`/sandwich/${year}`}>{year}</Link>
        </li>
      ))}
    </ul>
  );
}

export const metadata: Metadata = {
  title: "PDX Sandwich Week",
  description: "Fan site for PDX sandwich week",
};
