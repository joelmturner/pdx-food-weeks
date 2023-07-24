import Link from "next/link";
import { css } from "../styled-system/css";
import FilterProvider from "./filterProvider";
import "./globals.css";
import { ThemeSwitchButton } from "../components/themeSwitch";
import { Providers } from "../components/Providers";
import { Flex } from "../styled-system/jsx";
import { flex } from "../styled-system/patterns";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={css({ bg: "bg" })} suppressHydrationWarning>
      <head />
      <body>
        <Providers>
          <Flex justify="space-between" align={"center"} px={"6"}>
            <div className={css({ flex: "1" })}>
              <Link
                href="/"
                className={css({
                  textTransform: "none",
                  fontSize: "xl",
                  color: "text",
                })}
              >
                PDX Food Weeks
              </Link>
            </div>

            <div
              className={css({
                display: "none",
                alignItems: "center",
                gap: "2",
                md: { display: "flex" },
              })}
            >
              <ul className={flex({ gap: "2", color: "text" })}>
                <li
                  className={css({
                    fontSize: "xl",
                    px: "3",
                    py: "2",
                    cursor: "pointer",
                    _hover: {
                      color: "secondary",
                    },
                  })}
                >
                  <Link href="/burger">Burgers</Link>
                </li>
                <li
                  className={css({
                    fontSize: "xl",
                    px: "3",
                    py: "2",
                    cursor: "pointer",
                    _hover: {
                      color: "secondary",
                    },
                  })}
                >
                  <Link href="/nacho">Nachos</Link>
                </li>
                <li
                  className={css({
                    fontSize: "xl",
                    px: "3",
                    py: "2",
                    cursor: "pointer",
                    _hover: {
                      color: "secondary",
                    },
                  })}
                >
                  <Link href="/sandwich">Sandwiches</Link>
                </li>
              </ul>
              <ThemeSwitchButton />
            </div>

            <div className={css({ lg: { display: "none" } })}>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className={css({})}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={css({ h: "5", w: "5" })}
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
                </label>
                <ul
                  tabIndex={0}
                  className={css({
                    mt: "3",
                    p: "2",
                    shadow: "lg",
                    w: "52",
                  })}
                >
                  <li>
                    <Link href="/burger">Burgers</Link>
                  </li>
                  <li>
                    <Link href="/nacho">Nachos</Link>
                  </li>
                  <li>
                    <Link href="/sandwich">Sandwiches</Link>
                  </li>
                </ul>
              </div>
            </div>
          </Flex>
          <FilterProvider>{children}</FilterProvider>
        </Providers>
      </body>
    </html>
  );
}
