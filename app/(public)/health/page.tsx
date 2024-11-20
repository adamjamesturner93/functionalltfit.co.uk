import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { HealthDataForm } from './health-data-form';
import { HealthDataGraph } from './health-data-graph';
import { getHealthData } from '@/app/actions/health';

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
        <HealthDataGraph data={healthData} />
      </div>
    </div>
  );
}
