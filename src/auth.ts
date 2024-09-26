import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db, session, user } from "astro:db";

const adapter = new DrizzleSQLiteAdapter(
  db as any,
  session as any,
  user as any
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: import.meta.env.PROD,
    },
  },
  getUserAttributes: attributes => {
    return {
      username: attributes.username,
      role: attributes.role,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<
      {
        id: string;
        username: string;
        password: string;
        role: "user" | "admin";
      },
      "id"
    >;
  }
}
