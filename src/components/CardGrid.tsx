import { Grid } from "@/styled-system/jsx";
import { CardData } from "../types";
import { Card } from "./Card";

export function CardGrid({ data }: { data: CardData[] }) {
  return (
    <Grid columns={{ base: 1, md: 2, lg: 3 }} gap={"6"}>
      {data.map(burger => (
        <Card key={burger.id} {...burger} />
      ))}
    </Grid>
  );
}
