import { getWorkoutSummary } from '@/app/actions/workouts';

import { notFound } from 'next/navigation';
import { WorkoutSummary } from './workout-summary';
import { getCurrentUser } from '@/app/actions/profile';

export default async function WorkoutSummaryPage({ params }: { params: { id: string } }) {
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
