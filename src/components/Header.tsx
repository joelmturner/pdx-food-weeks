import { Filters } from "./Filters";
import Image from "@/components/Image";
import { FOOD_VS_LOGO_URL } from "@/constants";
import { css, cx } from "@/styled-system/css";
import { Flex } from "@/styled-system/jsx";
import { flex } from "@/styled-system/patterns";

export function Header({
  title,
  subtitle,
  neighborhoods,
  food,
}: {
  title: string;
  subtitle?: string;
  neighborhoods?: string[];
  food: keyof typeof FOOD_VS_LOGO_URL;
}) {
  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexDir: { base: "column" },
      })}
    >
      <Flex justify="space-between" align="center" w="full">
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            gap: "3",
          })}
        >
          <Image
            src={FOOD_VS_LOGO_URL[food]}
            className={css({
              w: { base: "8", lg: "full" },
              h: { base: "8", lg: "full" },
              objectFit: "contain",
              aspectRatio: "square",
            })}
            alt={`pdx ${food.toLocaleLowerCase()} week logo`}
            height={150}
            width={150}
          />

          <div className={flex({ direction: "column", gap: "1" })}>
            <h2
              className={css({
                fontSize: { base: "xl", lg: "2xl" },
                lineHeight: "tight",
                fontWeight: "bold",
              })}
            >
              {title}
            </h2>
            {subtitle ? (
              <h3
                className={css({
                  fontSize: "md",
                  color: "gray.300",
                  lineHeight: "tight",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                })}
              >
                {subtitle}
              </h3>
            ) : null}
          </div>
        </div>

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
      </Flex>

      <input
        type="checkbox"
        name="filterBox"
        id="filterBox"
        className={css({ visibility: "hidden", position: "absolute" })}
      />

      <div
        className={cx(
          css({
            display: "none",
            justifyContent: "flex-end",
            w: "full",
            "input[name='filterBox']:checked ~ &": { display: "flex" },
            pt: "3",
          })
        )}
      >
        <Filters neighborhoods={neighborhoods} />
      </div>
    </div>
  );
}
