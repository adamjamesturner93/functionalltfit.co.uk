import { NextRequest, NextResponse } from 'next/server';

import { leaveProgramme } from '@/app/actions/programmes';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await authorizeUser(request);
  const { id } = await params;

  if (!session) {
    return unauthorizedResponse();
  }

  const userId = session.user.id;

  try {
    await leaveProgramme(userId, id);
    return NextResponse.json({ message: 'Programme stopped successfully' });
  } catch (error) {
    console.error('Error stopping programme:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
