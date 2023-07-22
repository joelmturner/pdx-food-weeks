import { Filters } from "./Filters";
import Image from "../components/Image";
import { FOOD_VS_LOGO_URL } from "../constants";

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
    <div className="flex justify-between items-center flex-col lg:flex-row">
      <div className="flex items-center gap-3">
        <Image
          src={FOOD_VS_LOGO_URL[food]}
          className="w-full object-contain aspect-square"
          alt={`pdx ${food.toLocaleLowerCase()} week logo`}
          height={150}
          width={150}
        />

        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <div className="collapse collapse-arrow">
        <input type="checkbox" className="peer" />

        <div className="collapse-title text-neutral-content peer-checked:text-neutral-content">
          <div className="flex gap-3 justify-end items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
            Filters
          </div>
        </div>

        <div className="collapse-content text-neutral-content peer-checked:text-neutral-content max-w-2xl">
          <Filters neighborhoods={neighborhoods} />
        </div>
      </div>
    </div>
  );
}
