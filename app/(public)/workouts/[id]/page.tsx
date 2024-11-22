import { Suspense } from 'react';
import { ArrowLeft, BookmarkIcon, Clock, Dumbbell, Play, Target } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getWorkoutById, toggleWorkoutSave } from '@/app/actions/workouts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUserId } from '@/lib/auth-utils';

import { WorkoutStructure } from './workout-structure';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const userId = await getCurrentUserId();
  const workout = await getWorkoutById(id, userId);

  if (!workout) {
    return {
      title: 'Workout Not Found',
    };
  }

  return {
    title: `${workout.name} | FunctionallyFit`,
    description: workout.description,
  };
}

export default async function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  const workout = await getWorkoutById(id, userId);

  if (!workout) {
    notFound();
  }

  async function handleToggleSave() {
    'use server';
    if (userId) {
      await toggleWorkoutSave(id, userId);
    }
  }

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Link
            href="/workouts"
            className="mb-4 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Workouts
          </Link>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">{workout.name}</h1>
          <p className="text-muted-foreground">{workout.description}</p>
        </div>
        <div className="flex gap-2">
          {userId && (
            <form action={handleToggleSave}>
              <Button variant="secondary" size="sm">
                <BookmarkIcon className={`mr-2 size-4 ${workout.isSaved ? 'fill-current' : ''}`} />
                {workout.isSaved ? 'Saved' : 'Save Workout'}
              </Button>
            </form>
          )}
          <Button asChild size="sm">
            <Link href={`/workouts/${id}/start`}>
              <Play className="mr-2 size-4" />
              Start Workout
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-muted-foreground" />
            <span>{Math.floor(workout.totalLength / 60)} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Dumbbell className="size-5 text-muted-foreground" />
            <span>{workout.equipment.join(', ') || 'No equipment needed'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="size-5 text-muted-foreground" />
            <span>{workout.muscleGroups.join(', ')}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Muscle Groups</h2>
          <div className="flex flex-wrap gap-2">
            {workout.muscleGroups.map((group) => (
              <Badge key={group} variant="secondary">
                {group}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <WorkoutStructure workout={workout} />
      </Suspense>
    </div>
  );
}
