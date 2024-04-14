import { lucia } from "../../auth";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { db, list, user } from "astro:db";

import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const username = formData.get("username");
  const email = formData.get("email");

  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return new Response(
      JSON.stringify({
        error: "Invalid username",
      }),
      {
        status: 400,
      }
    );
  }

  // email must be a valid email address
  if (
    typeof email !== "string" ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  ) {
    return new Response(
      JSON.stringify({
        error: "Invalid email",
      }),
      {
        status: 400,
      }
    );
  }

  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return new Response(
      JSON.stringify({
        error: "Invalid password",
      }),
      {
        status: 400,
      }
    );
  }

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);

  try {
    const newUser = {
      id: userId,
      username,
      password: hashedPassword,
      email,
      role: "user",
    };
    await db.insert(user).values(newUser);

    // add new list for user
    await db
      .insert(list)
      .values({ name: "Saved List", foodIds: [], userId })
      .run();

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return new Response();
  } catch (e) {
    // if (e instanceof SqliteError && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
    // 	return new Response(
    // 		JSON.stringify({
    // 			error: "Username already used"
    // 		}),
    // 		{
    // 			status: 400
    // 		}
    // 	);
    // }
    return new Response(
      JSON.stringify({
        error: "An unknown error occurred",
      }),
      {
        status: 500,
      }
    );
  }
}
