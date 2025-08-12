import type { APIContext } from "astro";
import { db, list } from "astro:db";

export async function POST(context: APIContext): Promise<Response> {
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  const { userId } = context.locals.session;

  // handle both JSON and form data
  let name;
  const contentType = context.request.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const body = await context.request.json();
    name = body.name;
  } else {
    // handle form data
    const formData = await context.request.formData();
    name = formData.get("name") as string;
  }

  if (!name) {
    return new Response(JSON.stringify({ error: "List name is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const response = await db
      .insert(list)
      .values({
        userId,
        name,
        foodIds: [],
      })
      .run();

    return new Response(JSON.stringify({ id: `${response.lastInsertRowid}` }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating list:", error);

    // return error details for debugging
    return new Response(
      JSON.stringify({
        error: "Failed to create list",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
