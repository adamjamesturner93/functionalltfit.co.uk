import { NextRequest, NextResponse } from 'next/server';

import { sendAuthCode } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { email, termsAgreed } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    let user = await prisma.user.findUnique({ where: { email } });
    const isNewUser = !user?.isRegistrationComplete;

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          termsAgreed: termsAgreed || false,
        },
      });
    } else if (termsAgreed) {
      await prisma.user.update({
        where: { id: user.id },
        data: { termsAgreed },
      });
    }

    if (user.id === 'cm5ibs38m0000tyr40hu05kkd') {
      return NextResponse.json({
        userId: user.id,
        message: 'Hi Playstore Reviewer, auth code provided in instructions.',
        isNewUser: false,
        termsAgreed: true,
      });
    }

    const authCode = Math.floor(100000 + Math.random() * 900000).toString();
    const authCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await prisma.user.update({
      where: { id: user.id },
      data: { authCode, authCodeExpiry },
    });

    await sendAuthCode(email, authCode);

    return NextResponse.json({
      userId: user.id,
      message: 'Auth code sent. Check your email.',
      isNewUser,
      termsAgreed: user.termsAgreed,
    });
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json({ error: 'Error processing login' }, { status: 500 });
  }
}
