import { Inter } from "@next/font/google";
import Link from "next/link";
import { css } from "../styled-system/css";
import Image from "../components/Image";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div
      className={css({
        display: "grid",
        gridTemplateColumns: "cols.1",
        gap: "6",
        sm: { gridTemplateColumns: "cols.2" },
        lg: { gridTemplateColumns: "cols.3", gap: "8" },
        pt: "12",
        pb: "12",
      })}
    >
      <div
        className={css({
          ml: "auto",
          mr: "auto",
          overflow: "hidden",
          rounded: "lg",
          shadow: "shadow",
          display: "flex",
          flexDir: "column",
          p: "3",
        })}
      >
        <div
          className={css({
            display: "flex",
            h: "full",
            w: "full",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          <Link href="/burger">
            <Image
              src="https://res.cloudinary.com/joelmturner/image/upload/v1676264377/burgerweek/portland-mercury-burger-week-logo-isolated-removebg-preview.png"
              className={css({
                w: "full",
                objectFit: "contain",
                aspectRatio: "square",
              })}
              alt="pdx burger week logo"
              height={300}
              width={300}
            />
          </Link>
        </div>
        <div className={css({ p: "4" })}>
          <h3
            className={css({
              fontSize: "xl",
              lineHeight: "xl",
              fontWeight: "medium",
            })}
          >
            <Link href="/burger">PDX Burger Week</Link>
          </h3>
          <p className={css({ mt: "1" })}>
            Annual celebration of great burgers in Portland, Oregon.
          </p>
        </div>
      </div>
      <div
        className={css({
          ml: "auto",
          mr: "auto",
          overflow: "hidden",
          rounded: "lg",
          shadow: "shadow",
          display: "flex",
          flexDir: "column",
          p: "3",
        })}
      >
        <div
          className={css({
            display: "flex",
            h: "full",
            w: "full",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          <Link href="/sandwich">
            <Image
              src="https://res.cloudinary.com/joelmturner/image/upload/v1676264411/sandwichweek/portland-mercury-sandwich-week-logo-removebg-preview.png"
              className={css({
                w: "full",
                objectFit: "contain",
                aspectRatio: "square",
              })}
              alt="pdx sandwich week logo"
              height={300}
              width={300}
            />
          </Link>
        </div>
        <div className={css({ p: "4" })}>
          <h3
            className={css({
              fontSize: "xl",
              lineHeight: "xl",
              fontWeight: "medium",
            })}
          >
            <Link href="/sandwich">PDX Sandwich Week</Link>
          </h3>
          <p className={css({ mt: "1" })}>
            Annual celebration of great sandwiches in Portland, Oregon.
          </p>
        </div>
      </div>
      <div
        className={css({
          ml: "auto",
          mr: "auto",
          overflow: "hidden",
          rounded: "lg",
          shadow: "shadow",
          display: "flex",
          flexDir: "column",
          p: "3",
        })}
      >
        <div
          className={css({
            display: "flex",
            h: "full",
            w: "full",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          <Link href="/nacho">
            <Image
              src="https://res.cloudinary.com/joelmturner/image/upload/v1676264340/nachoweek/portland-mercury-nacho-week-logo-isolated-removebg-preview.png"
              className={css({
                w: "full",
                objectFit: "contain",
                aspectRatio: "square",
              })}
              alt="pdx nacho week logo"
              height={300}
              width={300}
            />
          </Link>
        </div>
        <div className={css({ p: "4" })}>
          <h3
            className={css({
              fontSize: "xl",
              lineHeight: "xl",
              fontWeight: "medium",
            })}
          >
            <Link href="/nacho">PDX Nacho Week</Link>
          </h3>
          <p className={css({ mt: "1" })}>
            Annual celebration of great nachos in Portland, Oregon.
          </p>
        </div>
      </div>
    </div>
  );
}
