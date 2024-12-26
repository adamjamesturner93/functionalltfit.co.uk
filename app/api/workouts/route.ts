import { NextRequest, NextResponse } from 'next/server';

import { getWorkouts } from '@/app/actions/workouts';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 9;
  const search = searchParams.get('search') || '';
  const filters = {
    equipment: searchParams.get('equipment') || undefined,
    muscleGroup: searchParams.get('muscleGroup') || undefined,
    minDuration: Number(searchParams.get('minDuration')) || undefined,
    maxDuration: Number(searchParams.get('maxDuration')) || undefined,
    saved: searchParams.get('saved') === 'true',
  };

  try {
    const workouts = await getWorkouts(page, pageSize, search, filters, session.user.id);
    return NextResponse.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
