import { Suspense } from 'react';
import { Search } from 'lucide-react';
import { Metadata } from 'next';

import { getWorkouts } from '@/app/actions/workouts';
import { toggleWorkoutSave } from '@/app/actions/workouts';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { getCurrentUserId } from '@/lib/auth-utils';

import { WorkoutCard } from './workout-card';
import { WorkoutCardSkeleton } from './workout-card-skeleton';
import { WorkoutFilters } from './workout-filters';

export const metadata: Metadata = {
  title: 'Workouts | Functionally Fit',
  description:
    'Browse and select from our collection of pre-built workouts to start your fitness journey.',
};

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    equipment?: string;
    muscleGroup?: string;
    minDuration?: string;
    maxDuration?: string;
    saved?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = 9;
  const search = params.search || '';
  const userId = await getCurrentUserId();

  const filters = {
    equipment: params.equipment,
    muscleGroup: params.muscleGroup,
    minDuration: params.minDuration ? parseInt(params.minDuration) : undefined,
    maxDuration: params.maxDuration ? parseInt(params.maxDuration) : undefined,
    saved: params.saved === 'true',
  };

  const { workouts, total } = await getWorkouts(page, pageSize, search, filters, userId!);

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
          <p className="text-muted-foreground">Choose from our collection of pre-built workouts</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <form className="relative">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search workouts..."
              className="pl-8"
              defaultValue={search}
              aria-label="Search workouts"
            />
          </form>
          <WorkoutFilters />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense
          fallback={Array(pageSize)
            .fill(null)
            .map((_, i) => (
              <WorkoutCardSkeleton key={i} />
            ))}
        >
          {workouts.length === 0 ? (
            <p className="col-span-full text-center">
              No workouts found. Try adjusting your search or filters.
            </p>
          ) : (
            <>
              {workouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  {...workout}
                  userId={userId}
                  isSaved={workout.isSaved}
                  onSaveToggle={async () => {
                    'use server';
                    if (!userId) return;
                    await toggleWorkoutSave(workout.id, userId);
                  }}
                />
              ))}
              <div className="col-span-full mt-6">
                <Pagination
                  totalItems={total}
                  pageSize={pageSize}
                  currentPage={page}
                  baseUrl="/workouts"
                  searchParams={await searchParams}
                />
              </div>
            </>
          )}
        </Suspense>
      </div>
    </div>
  );
}
