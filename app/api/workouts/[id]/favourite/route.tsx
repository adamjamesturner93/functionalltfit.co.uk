import { NextRequest, NextResponse } from 'next/server';

import { toggleWorkoutSave } from '@/app/actions/workouts';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const userId = session.user.id;

  try {
    await toggleWorkoutSave(id, userId);
    return NextResponse.json({ message: 'Workout favorite status toggled successfully' });
  } catch (error) {
    console.error('Error toggling workout favorite status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
