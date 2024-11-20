import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { googleId } = await request.json();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { Account: true },
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const googleAccount = existingUser.Account.find((account) => account.provider === 'google');

    if (googleAccount) {
      return NextResponse.json({ message: 'Google account already linked' }, { status: 400 });
    }

    await prisma.account.create({
      data: {
        userId: existingUser.id,
        type: 'oauth',
        provider: 'google',
        providerAccountId: googleId,
        refresh_token: null,
        access_token: null,
        expires_at: null,
        token_type: null,
        scope: null,
        id_token: null,
        session_state: null,
      },
    });

    return NextResponse.json({ message: 'Google account linked successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error linking Google account', error }, { status: 500 });
  }
}
