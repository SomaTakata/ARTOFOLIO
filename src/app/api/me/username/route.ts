import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { user } from '@/db/schema';
import { auth } from '@/auth';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    return NextResponse.json({ error: 'Username not set' }, { status: 404 });
  }

  return NextResponse.json({ username: result[0].username });
}
