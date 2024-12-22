import { NextRequest, NextResponse } from 'next/server';

import { completeWorkout } from '@/app/actions/workouts';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await authorizeUser(request);
  const { id: workoutId } = await params;

  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const { activityId, exercises } = await request.json();

    if (!activityId) {
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
    }

    console.log('workoutId: ', workoutId);
    console.log('activityId: ', activityId);
    console.log('userId: ', session.user.id);
    console.log('exercises: ', JSON.stringify(exercises, null, 4));
    const summary = await completeWorkout(activityId, workoutId, exercises, session.user.id);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error completing workout:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
