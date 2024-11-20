import { NextRequest, NextResponse } from 'next/server';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';
import { getWorkouts } from '@/app/actions/workouts';

export async function GET(request: NextRequest) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const workouts = await getWorkouts();
    return NextResponse.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
