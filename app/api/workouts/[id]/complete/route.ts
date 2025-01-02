import { NextRequest, NextResponse } from 'next/server';

import { completeWorkout } from '@/app/actions/workouts';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await authorizeUser(request);
  const { id } = await params;
  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const { workoutId, ...rest } = await request.json();

    const result = await completeWorkout(id, workoutId, session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error completing workout:', error);
    return NextResponse.json({ error: 'Failed to complete workout' }, { status: 500 });
  }
}
