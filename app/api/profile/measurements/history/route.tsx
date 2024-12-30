import { NextRequest, NextResponse } from 'next/server';

import { getMeasurementHistory } from '@/app/actions/measurements';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

  try {
    const { measurements, total } = await getMeasurementHistory(session.user.id, page, pageSize);

    return NextResponse.json({
      measurements,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching measurement history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
