import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';

export default async function BodyMeasurementsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Weekly Body Measurements</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2"></div>
    </div>
  );
}
