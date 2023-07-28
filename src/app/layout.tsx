import Link from "next/link";
import { css } from "../styled-system/css";
import FilterProvider from "./filterProvider";
import "./globals.css";
import { ThemeSwitchButton } from "../components/themeSwitch";
import { Providers } from "../components/Providers";
import { Flex } from "../styled-system/jsx";
import { flex } from "../styled-system/patterns";
import { NAVIGATION_ITEMS } from "@/constants";
import { MobileNav } from "@/components/mobileNav";

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
          <Flex justify="space-between" align="center" px="6" pt="6">
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

            <div
              className={css({
                display: "none",
                alignItems: "center",
                gap: "2",
                md: { display: "flex" },
              })}
            >
              <ul className={flex({ gap: "2", color: "text" })}>
                {NAVIGATION_ITEMS.map(item => (
                  <li
                    key={item.path}
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
                    <Link href={item.path}>{item.label}</Link>
                  </li>
                ))}
              </ul>
              <ThemeSwitchButton />
            </div>

            <MobileNav />
          </Flex>
          <FilterProvider>{children}</FilterProvider>
        </Providers>
      </body>
    </html>
  );
}
