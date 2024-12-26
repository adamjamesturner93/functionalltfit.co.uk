import { NextRequest, NextResponse } from 'next/server';

import { getActivityHistory } from '@/app/actions/activity';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  try {
    const { activities, total } = await getActivityHistory(userId, page, pageSize);

    return NextResponse.json({
      activities,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching activity history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
