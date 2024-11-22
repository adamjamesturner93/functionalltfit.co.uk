import { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { Toaster } from '@/components/ui/toaster';
import { auth } from '@/lib/auth';

import { Navigation } from '../components/admin/navigation';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/login');
  }
  return (
    <div className="flex h-screen bg-surface">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
      <Toaster />
    </div>
  );
}
