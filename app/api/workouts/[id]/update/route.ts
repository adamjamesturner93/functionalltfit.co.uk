import { NextRequest, NextResponse } from 'next/server';

import { updateWorkoutActivity } from '@/app/actions/workouts';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await authorizeUser(request);
  const { id } = await params;

  if (!session) {
    return unauthorizedResponse();
  }

  const { sets } = await request.json();

  try {
    const updatedWorkoutActivity = await updateWorkoutActivity(id, sets);
    return NextResponse.json(updatedWorkoutActivity);
  } catch (error) {
    console.error('Error updating workout activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
