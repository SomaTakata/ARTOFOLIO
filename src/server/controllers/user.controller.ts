import { RouteHandler } from "@hono/zod-openapi";
import { checkUsernameRoute, getUsernameRoute, setUsernameRoute } from "../routes/user.route";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";

export const getUsernameHandler: RouteHandler<typeof getUsernameRoute> = async (c) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const result = await db
    .select({
      username: user.username,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (result.length === 0 || !result[0].username) {
    return c.json({ error: "Not Found" }, 404);
  }

  return c.json({ username: result[0].username }, 200);
}

export const setUsernameHandler: RouteHandler<typeof setUsernameRoute> = async (c) => {
  const { username } = c.req.valid("json");

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session || !session.user?.id) {
    throw Error("Unauthorized");
  }

  const userId = session.user.id;

  if (!username) {
    return c.json({ error: "ユーザー名を入力してください" }, 400);
  }

  const existing = await db
    .select()
    .from(user)
    .where(and(eq(user.username, username), ne(user.id, userId)))
    .limit(1);

  if (existing.length > 0) {
    return c.json({ error: "このユーザー名はすでに使用されています" }, 409);
  }

  await db
    .update(user)
    .set({ username })
    .where(eq(user.id, userId));

  return c.json({ username: username }, 201);
}

export const checkUsernameHandler: RouteHandler<typeof checkUsernameRoute> = async (c) => {
  const { username } = c.req.query()

  if (!username) {
    return c.json({ available: false });
  }

  const result = await db
    .select()
    .from(user)
    .where(eq(user.username, username))
    .limit(1);

  const isAvailable = result.length === 0;

  return c.json({ available: isAvailable }, 200);
}
