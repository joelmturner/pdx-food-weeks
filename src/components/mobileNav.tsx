import { NAVIGATION_ITEMS } from "@/constants";
import { css } from "@/styled-system/css";
import Link from "next/link";

export function MobileNav() {
  return (
    <div className={css({ md: { display: "none" } })}>
      <input
        type="checkbox"
        name="drawer"
        id="drawer"
        className={css({ visibility: "hidden", position: "absolute" })}
      />

      <div
        className={css({
          display: "block",
          position: "absolute",
          inset: "0",
          transform: "translateX(100%)",
          bg: "amber.500",
          opacity: 0,
          transition: ["transform", "opacity"],
          transitionTimingFunction: "ease-in-out" as any,
          "input:checked ~ &": {
            transition: ["transform", "opacity"],
            transform: "translateX(0)",
            opacity: 1,
          },
          "&:has(ul:focus-within)": {
            transition: ["transform", "opacity"],
            transform: "translateX(100%)",
            opacity: 0,
          },
        })}
      >
        <ul
          tabIndex={0}
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
          {NAVIGATION_ITEMS.map(item => (
            <li key={item.path} className={css({ fontSize: "3xl" })}>
              <Link href={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <label
        tabIndex={0}
        htmlFor="drawer"
        className={css({ zIndex: 10 as any, position: "relative" })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={css({
            h: "5",
            w: "5",
            ":not(:has(ul:focus-within)) :has(input[id='drawer']:checked) &": {
              display: "none",
            },
          })}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className={css({
            w: "5",
            h: "5",
            display: "none",
            ":not(:has(ul:focus-within)) :has(input[id='drawer']:checked) &": {
              display: "block",
            },
          })}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </label>
    </div>
  );
}
