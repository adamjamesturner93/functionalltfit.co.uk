import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/app/actions/profile';

import { ProfileForm } from './profile-form';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Profile & Settings</h1>
      <ProfileForm user={user} />
    </div>
  );
}
