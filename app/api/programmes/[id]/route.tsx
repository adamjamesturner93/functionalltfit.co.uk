import { NextRequest, NextResponse } from 'next/server';

import { getProgramme } from '@/app/actions/programmes';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await authorizeUser(request);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;

    const programme = await getProgramme(id, userId);

    if (!programme) {
      return NextResponse.json({ error: 'Programme not found' }, { status: 404 });
    }

    return NextResponse.json(programme);
  } catch (error) {
    console.error('Error fetching programme:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
