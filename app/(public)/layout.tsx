import { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { Toaster } from '@/components/ui/toaster';
import { auth } from '@/lib/auth';

import { getUserById } from '../actions/users';

import { Navigation } from './Navigation';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface lg:flex-row">
      <Navigation user={user} />
      <main className="relative flex-1 overflow-y-auto pb-16 lg:pb-0">{children}</main>
      <Toaster />
    </div>
  );
}
