import { redirect } from 'next/navigation';

import { getHealthData } from '@/app/actions/health';
import { auth } from '@/lib/auth';

import { HealthDataForm } from './health-data-form';

export default async function HealthPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const healthData = await getHealthData(session.user.id, 365); // Get last year of data

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Monthly Health Check-in</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <HealthDataForm />
      </div>
    </div>
  );
}
