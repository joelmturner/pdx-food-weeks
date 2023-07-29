import { css } from "@/styled-system/css";
import { CardData } from "@/types";
import ClientImage from "./Image";

export function Card({
  description,
  title,
  url,
  location,
  locationUrl,
  hours,
  diet,
  imageUrl,
  neighborhood,
}: CardData) {
  const isCloudinary = imageUrl.includes("res.cloudinary.com");
  return (
    <div
      className={css({
        w: "full",
        shadow: "xl",
        borderRadius: "lg",
        overflow: "hidden",
        bg: "bg.muted",
      })}
    >
      <figure>
        {isCloudinary ? (
          <ClientImage
            width="600"
            height="600"
            src={imageUrl}
            sizes="30vw"
            alt={title}
          />
        ) : (
          <img
            src={imageUrl}
            width="600"
            height="600"
            sizes="30vw"
            alt={title}
          />
        )}
      </figure>

      <div
        className={css({
          display: "flex",
          flexDir: "column",
          gap: "2",
          p: "4",
        })}
      >
        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
            gap: "3",
            alignItems: "center",
          })}
        >
          <h3
            className={css({
              fontSize: "3xl",
              fontWeight: "bold",
              lineHeight: "relaxed",
              color: "primary",
            })}
          >
            <a href={url} target="_blank" rel="nofollow noopener noreferrer">
              {title}
            </a>
          </h3>
        </div>

        <div
          className={css({ display: "flex", gap: "3", alignItems: "center" })}
        >
          <h3
            className={css({
              fontSize: "xl",
              lineHeight: "loose",
              color: "secondary",
              w: "full",
            })}
          >
            <a
              href={locationUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              {location}
            </a>
          </h3>
          {hours ? <p>Hours: {hours}</p> : null}
        </div>

        <p
          className={css({
            color: "text",
            letterSpacing: "wide",
            lineHeight: "relaxed",
          })}
        >
          {description}
        </p>

        <div className={css({ justifyContent: "space-between" })}>
          <div
            className={css({
              display: "flex",
              gap: "1",
              md: { gap: "2" },
              lg: { gap: "3" },
            })}
          >
            <div className={css({ color: "text.muted" })}>Neighborhood:</div>
            {neighborhood.map(item => (
              <div key={item} className={css({ color: "text.muted" })}>
                {item}
              </div>
            ))}
          </div>

          <div
            className={css({
              display: "flex",
              gap: "1",
              md: { gap: "2" },
              lg: { gap: "3" },
            })}
          >
            <div className={css({ color: "text.muted" })}>Dietary Options:</div>
            <div className={css({ color: "text.muted" })}>
              {diet.join(", ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
