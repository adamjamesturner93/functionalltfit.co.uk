import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { getYogaVideos } from '@/app/actions/yoga-videos';
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

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 9;
  const search = searchParams.get('search') || '';
  const filters = {
    type: (searchParams.get('type') as 'MINDFULNESS' | 'BUILD' | 'EXPLORE') || undefined,
    // props: searchParams.get('props') || undefined,
    duration:
      (searchParams.get('duration') as 'less15' | '15to30' | '30to45' | '45plus') || undefined,
    savedOnly: Boolean(searchParams.get('savedOnly')) || undefined,
  };
  const sort = (searchParams.get('sort') as 'newest' | 'mostViewed' | 'leastViewed') || 'newest';

  try {
    const yogaVideos = await getYogaVideos(page, pageSize, search, filters, sort, session.user.id);

    return NextResponse.json(yogaVideos);
  } catch (error) {
    console.error('Error fetching yoga videos:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
