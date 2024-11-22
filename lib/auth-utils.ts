'use server';

import { NextRequest, NextResponse } from 'next/server';

import { auth } from './auth';

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export interface Session {
  user: SessionUser;
}

export async function authorizeUser(request: NextRequest): Promise<Session | null> {
  const sessionHeader = request.headers.get('X-Session');

  if (!sessionHeader) {
    return null;
  }

  try {
    const session = JSON.parse(sessionHeader) as Session;
    if (!session || !session.user) {
      return null;
    }
    return session;
  } catch (error) {
    console.error('Error parsing session:', error);
    return null;
  }
}

export async function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id || null;
}
