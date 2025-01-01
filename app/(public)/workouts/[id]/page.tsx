import { Suspense } from 'react';
import { ArrowLeft, BookmarkIcon, Clock, Dumbbell, Play, Target } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getWorkoutById, toggleWorkoutSave } from '@/app/actions/workouts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUserId } from '@/lib/auth-utils';
import { formatTime } from '@/lib/utils';

import { WorkoutStructure } from './workout-structure';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const userId = await getCurrentUserId();
  const { id } = await params;
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
  const userId = await getCurrentUserId();
  const { id } = await params;
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
    <div className="min-h-screen">
      <div className="container mx-auto space-y-8 py-12">
        {/* Header Section */}
        <div className="space-y-6">
          <Link
            href="/workouts"
            className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Workouts
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">{workout.name}</h1>
              {workout.description && (
                <p className="max-w-2xl text-lg text-muted-foreground">{workout.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              {userId && (
                <form action={handleToggleSave}>
                  <Button variant="outline" size="lg">
                    <BookmarkIcon
                      className={`mr-2 size-5 ${workout.isSaved ? 'fill-current' : ''}`}
                    />
                    {workout.isSaved ? 'Saved' : 'Save Workout'}
                  </Button>
                </form>
              )}
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link href={`/workouts/${id}/start`}>
                  <Play className="mr-2 size-5" />
                  Start Workout
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Workout Overview */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="size-5" />
                <span className="text-sm font-medium">Total Duration</span>
              </div>
              <p className="text-2xl font-bold">{formatTime(workout.totalLength)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="size-5" />
                <span className="text-sm font-medium">Target Areas</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {workout.primaryMuscles.map((muscle) => (
                  <Badge key={muscle} variant="secondary" className="rounded-full">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Dumbbell className="size-5" />
                <span className="text-sm font-medium">Equipment Needed</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {workout.equipment.map((item) => (
                  <Badge key={item} variant="outline" className="rounded-full">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Workout Structure */}
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <WorkoutStructure workout={workout} />
        </Suspense>
      </div>
    </div>
  );
}
