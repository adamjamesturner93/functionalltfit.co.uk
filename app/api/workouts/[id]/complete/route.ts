import { NextRequest, NextResponse } from 'next/server';

import { completeWorkout } from '@/app/actions/workouts';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await authorizeUser(request);
  const { id } = await params;

  if (!session) {
    return unauthorizedResponse();
  }

  const { activityId, exercises } = await request.json();

  try {
    const summary = await completeWorkout(activityId, id, exercises, session.user.id);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error completing workout:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
