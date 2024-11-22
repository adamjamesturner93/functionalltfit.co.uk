import { NextRequest, NextResponse } from 'next/server';

import { getWorkoutById } from '@/app/actions/workouts';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await authorizeUser(request);
  const { id } = await params;

  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const workout = await getWorkoutById(id);
    return NextResponse.json(workout);
  } catch (error) {
    console.error('Error fetching workout:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
