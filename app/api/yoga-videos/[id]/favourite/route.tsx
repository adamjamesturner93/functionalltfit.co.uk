import { NextRequest, NextResponse } from 'next/server';

import { toggleYogaVideoSave } from '@/app/actions/yoga-videos';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await authorizeUser(request);
  const { id } = await params;

  if (!session) {
    return unauthorizedResponse();
  }

  const userId = session.user.id;

  try {
    await toggleYogaVideoSave(id, userId);
    return NextResponse.json({ message: 'Yoga video favorite status toggled successfully' });
  } catch (error) {
    console.error('Error toggling yoga video favorite status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
