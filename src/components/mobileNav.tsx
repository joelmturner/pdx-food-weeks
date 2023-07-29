"use client";

import { NAVIGATION_ITEMS } from "@/constants";
import { css } from "@/styled-system/css";
import { ThemeSwitchButton } from "./themeSwitch";
import { Flex } from "@/styled-system/jsx";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DRAWER_OPEN_STYLES = {
  transform: "translateX(0)",
  opacity: 1,
};

export function MobileNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  function handleToggleDrawer() {
    setDrawerOpen(prev => !prev);
  }

  function handleNavigation(path: string) {
    setDrawerOpen(false);
    router.push(path);
  }

  return (
    <div className={css({ md: { display: "none" } })}>
      <div
        className={css({
          position: "fixed",
          inset: "0",
          bg: "amber.500",
          transitionTimingFunction: "ease-in-out" as any,
          transition: ["transform", "opacity"],
          transform: "translateX(100%)",
          opacity: 0,
          ...(drawerOpen ? DRAWER_OPEN_STYLES : {}),
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
          })}
        >
          {NAVIGATION_ITEMS.map(item => (
            <li key={item.path} className={css({ fontSize: "5xl" })}>
              <div onClick={() => handleNavigation(item.path)}>
                {item.label}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Flex align="center" gap="1">
        <ThemeSwitchButton />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={css({
            w: "5",
            h: "5",
            zIndex: 10 as any,
          })}
          onClick={handleToggleDrawer}
        >
          {drawerOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          )}
        </svg>
      </Flex>
    </div>
  );
}
