import type { APIContext } from "astro";
import { Food, db } from "astro:db";
import type { FoodItem } from "types";

export async function POST(context: APIContext): Promise<Response> {
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  const data = await context.request.json();
  const allData = JSON.parse(data.data) as FoodItem[];
  const year = parseInt(data.year);
  const type = data.type;

  if (!allData || !year || !type) {
    return new Response(null, {
      status: 400,
    });
  }

  const result = await db
    .insert(Food)
    .values(allData.map(({ id, ...item }) => ({ ...item, year, type })));

  if (!result) {
    return new Response(null, {
      status: 500,
    });
  }

  return new Response();
}
