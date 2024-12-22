import { NextRequest, NextResponse } from 'next/server';

import { updateUserExerciseWeight } from '@/app/actions/workouts';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await authorizeUser(request);
  const { id } = await params;

  if (!session) {
    return unauthorizedResponse();
  }

  const { exerciseId, newWeight } = await request.json();

  try {
    await updateUserExerciseWeight(id, exerciseId, newWeight, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating exercise weight:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
