import { NAVIGATION_ITEMS } from "@/constants";
import { css } from "@/styled-system/css";
import {
  CssVarProperties,
  SystemProperties,
} from "@/styled-system/types/style-props";
import Link from "next/link";
import { ThemeSwitchButton } from "./themeSwitch";
import { Flex } from "@/styled-system/jsx";

const RESET_DRAWER: SystemProperties & CssVarProperties = {
  transition: ["transform", "opacity"],
  transform: "translateX(100%)",
  opacity: 0,
};

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
          position: "fixed",
          inset: "0",
          bg: "amber.500",
          transitionTimingFunction: "ease-in-out" as any,
          userSelect: "none",
          pointerEvents: "none",
          ...RESET_DRAWER,
          "input:checked ~ &": {
            transition: ["transform", "opacity"],
            transform: "translateX(0)",
            opacity: 1,
          },
          "&:has(ul:focus-within)": RESET_DRAWER,
        })}
      >
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
            userSelect: "auto",
            pointerEvents: "auto",
          })}
        >
          {NAVIGATION_ITEMS.map(item => (
            <li key={item.path} className={css({ fontSize: "3xl" })}>
              <Link href={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <Flex align="center" gap="1">
        <ThemeSwitchButton />

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
              ":not(:has(ul:focus-within)) :has(input[id='drawer']:checked) &":
                {
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
              ":not(:has(ul:focus-within)) :has(input[id='drawer']:checked) &":
                {
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
      </Flex>
    </div>
  );
}
