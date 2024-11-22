import { NextRequest, NextResponse } from 'next/server';

import { startWorkout } from '@/app/actions/workouts';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await authorizeUser(request);
  const { id } = await params;

  if (!session) {
    return unauthorizedResponse();
  }

  const workoutId = id;

  if (!workoutId) {
    return NextResponse.json({ error: 'Workout ID is required' }, { status: 400 });
  }

  try {
    const combinedWorkout = await startWorkout(workoutId, session.user.id);
    return NextResponse.json(combinedWorkout);
  } catch (error) {
    console.error('Error starting workout:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
