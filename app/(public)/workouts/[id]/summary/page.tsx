import { notFound } from 'next/navigation';

import { getCurrentUser } from '@/app/actions/profile';
import { getWorkoutSummary } from '@/app/actions/workouts';
import { WorkoutSummary } from '@/components/workout-summary/workout-summary';

export default async function WorkoutSummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await params;

  if (!user) {
    notFound();
  }

  const summary = await getWorkoutSummary(id);
  if (!summary) {
    notFound();
  }

  return (
    <WorkoutSummary
      summary={summary}
      workoutActivityId={id}
      userId={user.id}
      userPreferences={{
        lengthUnit: user.preferences?.lengthUnit || 'METRIC',
        weightUnit: user.preferences?.weightUnit || 'METRIC',
      }}
    />
  );
}
