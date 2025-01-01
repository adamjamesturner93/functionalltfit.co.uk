import { NextRequest, NextResponse } from 'next/server';

import { startWorkout } from '@/app/actions/workouts';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await authorizeUser(request);
  const { id } = await params;

  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const workout = await startWorkout(id, session.user.id);
    return NextResponse.json(workout);
  } catch (error) {
    console.error('Error starting workout:', error);
    return NextResponse.json({ error: 'Failed to start workout' }, { status: 500 });
  }
}
