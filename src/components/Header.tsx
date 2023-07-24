import { Filters } from "./Filters";
import Image from "../components/Image";
import { FOOD_VS_LOGO_URL } from "../constants";
import { css, cx } from "../styled-system/css";
import { Flex } from "@/styled-system/jsx";

export function Header({
  title,
  neighborhoods,
  food,
}: {
  title: string;
  neighborhoods?: string[];
  food: keyof typeof FOOD_VS_LOGO_URL;
}) {
  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDir: "column",
        lg: { flexDir: "row" },
      })}
    >
      <div className={css({ display: "flex", alignItems: "center", gap: "3" })}>
        <Image
          src={FOOD_VS_LOGO_URL[food]}
          className={css({
            w: "full",
            objectFit: "contain",
            aspectRatio: "square",
          })}
          alt={`pdx ${food.toLocaleLowerCase()} week logo`}
          height={150}
          width={150}
        />

        <h2
          className={css({
            fontSize: "2xl",
            lineHeight: "loose",
            fontWeight: "bold",
          })}
        >
          {title}
        </h2>
      </div>

      <Flex gap="6" direction="column">
        <input
          type="checkbox"
          name="filterBox"
          id="filterBox"
          className={css({ visibility: "hidden" })}
        />

        <label className={css({ cursor: "pointer" })} htmlFor="filterBox">
          <div
            className={css({
              display: "flex",
              gap: "3",
              justifyContent: "flex-end",
              alignItems: "center",
            })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={css({ w: "6", h: "6" })}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
            Filters
          </div>
        </label>

        <div
          className={cx(
            css({
              display: "none",
              maxW: "2xl",
              "input:checked ~ &": { display: "block" },
            })
          )}
        >
          <Filters neighborhoods={neighborhoods} />
        </div>
      </Flex>
    </div>
  );
}
