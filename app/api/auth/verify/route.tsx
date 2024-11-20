import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sign } from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  const { userId, authCode } = await request.json();

  if (!userId || !authCode) {
    console.error('Missing required fields');
    console.log({ userId, authCode });
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error('User not found');
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.authCode !== authCode || user.authCodeExpiry! < new Date()) {
      console.error('Invalid or expired auth code');
      return NextResponse.json({ message: 'Invalid or expired auth code' }, { status: 400 });
    }

    // Clear the auth code
    await prisma.user.update({
      where: { id: user.id },
      data: { authCode: null, authCodeExpiry: null },
    });

    const token = sign({ userId: user.id }, process.env.AUTH_SECRET!, {
      expiresIn: '7d',
    });

    // Remove sensitive information from the user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authCode: _, authCodeExpiry: __, ...safeUser } = user;

    console.log('Success');
    return NextResponse.json(
      { message: 'Login successful', token, user: safeUser },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error verifying auth code:', error);
    return NextResponse.json({ message: 'Error verifying auth code' }, { status: 500 });
  }
}
