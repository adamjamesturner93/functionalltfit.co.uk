import { NextRequest, NextResponse } from 'next/server';

import { updateWorkoutActivity } from '@/app/actions/workouts';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await authorizeUser(request);
  const { id } = await params;

  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const { exercises } = await request.json();

    console.log(JSON.stringify(exercises, null, 4));
    const result = await updateWorkoutActivity(id, exercises);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating workout:', error);
    return NextResponse.json({ error: 'Failed to update workout' }, { status: 500 });
  }
}
