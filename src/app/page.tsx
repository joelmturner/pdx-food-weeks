import Link from "next/link";
import Image from "@/components/Image";
import { Grid } from "@/styled-system/jsx";
import { css } from "@/styled-system/css";

export default function Home() {
  return (
    <Grid
      columns={{ base: 1, sm: 2, lg: 3 }}
      gap="6"
      py={{ base: "6", lg: "12" }}
      px={{ base: "6", lg: "12" }}
    >
      <div
        className={css({
          ml: "auto",
          mr: "auto",
          overflow: "hidden",
          rounded: "lg",
          shadow: "lg",
          display: "flex",
          flexDir: "column",
          p: "3",
          bg: "bg.muted",
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
              lineHeight: "loose",
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
          shadow: "lg",
          display: "flex",
          flexDir: "column",
          p: "3",
          bg: "bg.muted",
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
              lineHeight: "loose",
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
          shadow: "lg",
          display: "flex",
          flexDir: "column",
          p: "3",
          bg: "bg.muted",
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
              lineHeight: "loose",
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
    </Grid>
  );
}
