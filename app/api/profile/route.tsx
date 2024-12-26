import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser, updateProfile } from '@/app/actions/profile';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function PUT(request: NextRequest) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const userId = session.user.id;

  try {
    const formData = await request.formData();
    const result = await updateProfile(userId, formData);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const userProfile = await getCurrentUser(session.user.id);

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Remove sensitive information before sending the response
    const { ...safeUserProfile } = userProfile;

    return NextResponse.json(safeUserProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
