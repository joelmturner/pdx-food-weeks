import type { APIContext } from "astro";
import { db, events } from "astro:db";

export async function POST(context: APIContext): Promise<Response> {
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  // add event details to events table
  const data = await context.request.json();
  const event = await db.insert(events).values(data).run();

  if (event) {
    return new Response(null, { status: 200 });
  } else {
    return new Response(null, { status: 400 });
  }
}
