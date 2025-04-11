
import { auth } from '@/auth';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Zodバリデーション
const setUsernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "英数字とアンダースコアのみ使用可能です"),
});

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parse = setUsernameSchema.safeParse(body);

  if (!parse.success) {
    return NextResponse.json({ error: "Invalid username format" }, { status: 400 });
  }

  const { username } = parse.data;
  const userId = session.user.id;

  // すでに他のユーザーがこの username を使っていないかチェック
  const existing = await db
    .select()
    .from(user)
    .where(and(eq(user.username, username), ne(user.id, userId)))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ error: "このユーザー名はすでに使用されています" }, { status: 409 });
  }

  // 自分のレコードに username を設定
  await db
    .update(user)
    .set({ username })
    .where(eq(user.id, userId));

  return NextResponse.json({ success: true });
}
