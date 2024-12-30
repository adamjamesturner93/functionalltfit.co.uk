import { NextRequest, NextResponse } from 'next/server';

import { getMeasurementsAggregated, logMeasurement } from '@/app/actions/measurements';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const userId = session.user.id;
  const data = await request.json();

  const result = await logMeasurement(userId, data);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}

export async function GET(request: NextRequest) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);
  const period = (searchParams.get('period') as '1w' | '1m' | '3m' | '6m' | '12m' | 'all') || 'all';

  const result = await getMeasurementsAggregated(userId, period);

  console.log(JSON.stringify(result, null, 4));

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
