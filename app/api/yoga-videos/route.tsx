import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

const prisma = new PrismaClient();

export const config = {
  runtime: 'edge',
};

export async function GET(request: NextRequest) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const yogaVideos = await prisma.yogaVideo.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        props: true,
        duration: true,
        thumbnailUrl: true,
      },
    });

    return NextResponse.json(yogaVideos);
  } catch (error) {
    console.error('Error fetching yoga videos:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
