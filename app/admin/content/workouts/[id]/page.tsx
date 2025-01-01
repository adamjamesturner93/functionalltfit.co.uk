import { notFound } from 'next/navigation';

import { getExercises } from '@/app/actions/exercises';
import { getWorkoutById } from '@/app/actions/workouts';
import { WorkoutForm } from '@/components/workout-builder/workout-form';

export default async function EditWorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [workout, { exercises }] = await Promise.all([
    id === 'new' ? null : getWorkoutById(id),
    getExercises(1, 1000),
  ]);

  if (id !== 'new' && !workout) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <WorkoutForm workout={workout} exercises={exercises} />
    </div>
  );
}
