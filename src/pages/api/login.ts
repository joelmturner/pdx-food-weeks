import { lucia } from "../../auth";
import { Argon2id } from "oslo/password";
import { db, eq, user } from "astro:db";

import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
	const formData = await context.request.formData();
	const username = formData.get("username");
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return new Response(JSON.stringify({ error: "Invalid username" }), {
			status: 400
		});
	}
	const password = formData.get("password");
	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		return new Response(JSON.stringify({ error: "Invalid password" }), {
			status: 400
		});
	}

	const existingUserResults = await db.select({ id: user.id, username: user.username, password: user.password }).from(user).where(eq(user.username, username));
    const existingUser = existingUserResults?.[0];

	if (!existingUser) {
		return new Response(
			JSON.stringify({
				error: "Incorrect username or password"
			}),
			{
				status: 400
			}
		);
	}

	const validPassword = await new Argon2id().verify(existingUser.password, password);
	if (!validPassword) {
		return new Response(
			JSON.stringify({
				error: "Incorrect username or password"
			}),
			{
				status: 400
			}
		);
	}

	const session = await lucia.createSession(existingUser.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	return new Response();
}