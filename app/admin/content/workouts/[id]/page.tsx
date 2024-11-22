import { notFound } from 'next/navigation';

import { getWorkoutById } from '@/app/actions/workouts';

import { WorkoutForm } from './workout-form';

export default async function EditWorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workout = id === 'new' ? null : await getWorkoutById(id);

  if (id !== 'new' && !workout) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-2xl font-bold">{workout ? 'Edit Workout' : 'Create New Workout'}</h1>
      <WorkoutForm workout={workout} />
    </div>
  );
}
