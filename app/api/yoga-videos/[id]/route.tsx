import { NextRequest, NextResponse } from 'next/server';

import { getYogaVideoById } from '@/app/actions/yoga-videos';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const session = await authorizeUser(request);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;
    const yogaVideo = await getYogaVideoById(id, userId);

    if (!yogaVideo) {
      return NextResponse.json({ error: 'Yoga video not found' }, { status: 404 });
    }

    return NextResponse.json(yogaVideo);
  } catch (error) {
    console.error('Error fetching yoga video:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
