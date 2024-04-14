import type { APIContext } from "astro";
import { and, db, eq, inArray, list, notInArray } from "astro:db";

export async function POST(context: APIContext): Promise<Response> {
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  const { userId } = context.locals.session;
  const { listId } = await context.request.json();

  if (listId) {
    await db
      .delete(list)
      .where(and(eq(list.id, listId), eq(list.userId, userId)))
      .run();
  }

  return new Response(null, {
    status: 200,
  });
}
