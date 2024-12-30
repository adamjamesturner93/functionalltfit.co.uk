import { NextRequest, NextResponse } from 'next/server';

import { deleteMeasurement } from '@/app/actions/measurements';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const userId = session.user.id;
  const { id: measurementId } = await params;

  const result = await deleteMeasurement(userId, measurementId);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
