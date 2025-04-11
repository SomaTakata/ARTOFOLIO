// app/api/check-username/route.ts
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ available: false });
  }

  const result = await db.select().from(user).where(eq(user.username, username)).limit(1);

  const isAvailable = result.length === 0;

  return NextResponse.json({ available: isAvailable });
}
