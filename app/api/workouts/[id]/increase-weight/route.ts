import { NextRequest, NextResponse } from 'next/server';

import { updateUserExerciseWeight } from '@/app/actions/workouts';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await authorizeUser(request);
  const { id } = await params;
  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const { exerciseId, newWeight } = await request.json();
    await updateUserExerciseWeight(id, exerciseId, newWeight, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error increasing weight:', error);
    return NextResponse.json({ error: 'Failed to increase weight' }, { status: 500 });
  }
}
