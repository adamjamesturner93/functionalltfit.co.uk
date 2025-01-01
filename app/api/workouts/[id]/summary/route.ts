import { NextRequest, NextResponse } from 'next/server';

import { getWorkoutSummary } from '@/app/actions/workouts';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await authorizeUser(request);
  const { id } = await params;

  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const summary = await getWorkoutSummary(id);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching workout summary:', error);
    return NextResponse.json({ error: 'Failed to fetch workout summary' }, { status: 500 });
  }
}
