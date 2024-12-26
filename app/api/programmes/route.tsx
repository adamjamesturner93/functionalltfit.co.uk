import { NextRequest, NextResponse } from 'next/server';

import { getProgrammes } from '@/app/actions/programmes';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 9;
    const search = searchParams.get('search') || '';
    const filters = {
      intention: searchParams.get('intention') || undefined,
      length: searchParams.get('length') || undefined,
      minSessions: Number(searchParams.get('minSessions')) || undefined,
      maxSessions: Number(searchParams.get('maxSessions')) || undefined,
      saved: searchParams.get('saved') === 'true',
    };

    const session = await authorizeUser(request);

    if (!session) {
      return unauthorizedResponse();
    }

    const userId = session.user.id;

    const { programmes, total } = await getProgrammes(page, pageSize, search, filters, userId);

    return NextResponse.json({ programmes, total });
  } catch (error) {
    console.error('Error fetching programmes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
