import type { APIContext } from "astro";
import { db, eq, inArray, list, notInArray } from "astro:db";

export async function POST(context: APIContext): Promise<Response> {
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }
  const { userId } = context.locals.session;
  const { foodId, listIds } = await context.request.json();

  let resolvedListIds = listIds;

  // create a new list if user has no lists
  if (!listIds) {
    const response = await db
      .insert(list)
      .values({ name: "Saved List", foodIds: [], userId })
      .run();
    resolvedListIds = [response.lastInsertRowid];
  }

  if (resolvedListIds.length) {
    const savedLists = await db
      .select()
      .from(list)
      .where(inArray(list.id, resolvedListIds));

    // loop over savedLists and add foodId to each list
    if (savedLists.length) {
      await Promise.all(
        savedLists.map(async savedList => {
          const updatedList = {
            ...savedList,
            foodIds: [...new Set([...(savedList.foodIds as string[]), foodId])],
          };
          await db
            .update(list)
            .set(updatedList)
            .where(eq(list.id, savedList.id))
            .run();
        })
      );
    }
  }

  // remove from other lists
  const base = db.select().from(list);

  const otherLists = listIds?.length
    ? await base.where(notInArray(list.id, listIds ? listIds : []))
    : await base;

  if (otherLists.length) {
    await Promise.all(
      otherLists.map(async otherList => {
        const updatedList = {
          ...otherList,
          foodIds: [
            ...new Set(
              (otherList.foodIds as string[]).filter(
                (id: string) => id !== foodId
              )
            ),
          ],
        };

        await db
          .update(list)
          .set(updatedList)
          .where(eq(list.id, otherList.id))
          .run();
      })
    );
  }

  return new Response(null, {
    status: 204,
  });
}
