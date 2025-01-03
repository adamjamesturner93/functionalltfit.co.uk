import { NextRequest, NextResponse } from 'next/server';

import {
  getCurrentUser,
  getExtendedUserProfile,
  ProfileFormValues,
  updateProfile,
} from '@/app/actions/profile';
import { authorizeUser, unauthorizedResponse } from '@/lib/auth-utils';

export async function PUT(request: NextRequest) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const userId = session.user.id;

  try {
    const profileData: ProfileFormValues = await request.json();

    const result = await updateProfile(userId, profileData);

    if (result.error) {
      return NextResponse.json({ error: result.error, details: result.details }, { status: 400 });
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
    const extendedProfile = await getExtendedUserProfile(session.user.id);

    if (!extendedProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    return NextResponse.json(extendedProfile);
  } catch (error) {
    console.error('Error fetching extended user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
