import Link from "next/link";
import { css } from "@/styled-system/css";
import { NACHO_YEARS } from "./constants";
import { Metadata } from "next";

export default function NachoPage() {
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
      {NACHO_YEARS.map(year => (
        <li key={year} className={css({ fontSize: "5xl" })}>
          <Link href={`/nacho/${year}`}>{year}</Link>
        </li>
      ))}
    </ul>
  );
}

export const metadata: Metadata = {
  title: "PDX Nacho Week",
  description: "Fan site for PDX nacho week",
};
