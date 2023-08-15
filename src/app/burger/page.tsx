import Link from "next/link";
import { css } from "@/styled-system/css";
import { BURGER_YEARS } from "./constants";
import { Metadata } from "next";

export default function BurgerPage() {
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
      {BURGER_YEARS.map(year => (
        <li key={year} className={css({ fontSize: "5xl" })}>
          <Link href={`/burger/${year}`}>{year}</Link>
        </li>
      ))}
    </ul>
  );
}

export const metadata: Metadata = {
  title: "PDX Burger Week",
  description: "Fan site for PDX burger week",
};
