import { NextRequest, NextResponse } from 'next/server';

import { getWorkoutSummary } from '@/app/actions/workouts';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const { id: workoutActivityId } = await params;

  try {
    const summary = await getWorkoutSummary(workoutActivityId);

    if (!summary) {
      return NextResponse.json({ error: 'Workout summary not found' }, { status: 404 });
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching workout summary:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
