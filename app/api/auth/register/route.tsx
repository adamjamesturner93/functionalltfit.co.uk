import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAuthCode, sendAuthCode } from '@/lib/auth';
import { User } from '@/types';

export async function POST(request: Request) {
  const { name, email } = await request.json();

  if (!name || !email) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const authCode = generateAuthCode();
    const authCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const user: User = await prisma.user.create({
      data: {
        name,
        email,
        authCode,
        authCodeExpiry,
        role: 'USER',
      },
    });

    await sendAuthCode(email, authCode);

    return NextResponse.json(
      {
        message: 'User created successfully. Check your email for the auth code.',
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ message: 'Error creating user', error }, { status: 500 });
  }
}
