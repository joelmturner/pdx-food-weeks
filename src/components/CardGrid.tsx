import { CardData } from "../types";
import { Card } from "./Card";

export function CardGrid({ data }: { data: CardData[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {data.map(burger => (
        <Card key={burger.id} {...burger} />
      ))}
    </div>
  );
}
