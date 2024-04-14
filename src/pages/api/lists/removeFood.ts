import type { APIContext } from "astro";
import { and, db, eq, list } from "astro:db";

export async function POST(context: APIContext): Promise<Response> {
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  const { userId } = context.locals.session;
  const { listId, foodId } = await context.request.json();

  if (listId && foodId) {
    const resolvedList = await db
      .select({ foodIds: list.foodIds })
      .from(list)
      .where(and(eq(list.id, listId), eq(list.userId, userId)));

    const updatedList = (resolvedList?.[0].foodIds as string[]).filter(
      // eww gross
      (id: string) => id + "" !== foodId + ""
    );

    const done = await db
      .update(list)
      .set({
        foodIds: updatedList,
      })
      .where(and(eq(list.id, listId), eq(list.userId, userId)))
      .run();

    if (done) {
      return new Response(null, {
        status: 200,
      });
    }
  }

  return new Response(null, {
    status: 400,
  });
}
