import { CardData } from "../types";
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
  return (
    <div className="card w-full bg-neutral shadow-xl">
      <figure>
        <ClientImage
          width="600"
          height="600"
          src={imageUrl}
          sizes="30vw"
          alt={title}
        />
      </figure>

      <div className="card-body">
        <div className="flex justify-between gap-3 items-center">
          <h3 className="card-title text-2xl text-accent">
            <a href={url} target="_blank" rel="nofollow noopener noreferrer">
              {title}
            </a>
          </h3>
        </div>

        <div className="flex gap-3 items-center">
          <h3 className="text-lg text-neutral-content">
            <a
              href={locationUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              {location}
            </a>
          </h3>
          <div className="tooltip" data-tip={hours}>
            <p className="underline">Hours</p>
          </div>
        </div>

        <p className="prose">{description}</p>

        <div className="card-actions justify-between">
          <div className="flex gap-1 md:gap-2 lg:gap-3">
            {neighborhood.map(item => (
              <div key={item} className="text-neutral-content">
                {item}
              </div>
            ))}
          </div>

          <div className="flex gap-1 md:gap-2 lg:gap-3">
            {diet.map(item => (
              <div key={item} className="text-neutral-content">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
