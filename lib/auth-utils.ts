'use server';

import { jwtVerify, SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from './auth';
import { prisma } from './prisma';

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

export async function generateRefreshToken(userId: string): Promise<string> {
  const refreshToken = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET));

  // Store the refresh token in the database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: userId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  return refreshToken;
}

export async function verifyRefreshToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET),
    );

    // Check if the token exists in the database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return null;
    }

    return payload.userId as string;
  } catch (error) {
    console.error('Error verifying refresh token:', error);
    return null;
  }
}
