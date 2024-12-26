import { NextRequest, NextResponse } from 'next/server';

import { toggleProgrammeSave } from '@/app/actions/programmes';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const userId = session.user.id;

  try {
    await toggleProgrammeSave(id, userId);
    return NextResponse.json({ message: 'Programme favorite status toggled successfully' });
  } catch (error) {
    console.error('Error toggling programme favorite status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
