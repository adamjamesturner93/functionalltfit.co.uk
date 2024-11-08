import { Suspense } from "react";
import { Metadata } from "next";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getWorkouts } from "@/app/actions/workouts";
import { WorkoutFilters } from "./workout-filters";
import { WorkoutCard } from "./workout-card";
import { WorkoutCardSkeleton } from "./workout-card-skeleton";
import { Pagination } from "@/components/ui/pagination";
import { getCurrentUserId } from "@/lib/auth-utils";
import { toggleWorkoutSave } from "@/app/actions/workouts";

export const metadata: Metadata = {
  title: "Workouts | FunctionallyFit",
  description:
    "Browse and select from our collection of pre-built workouts to start your fitness journey.",
};

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    equipment?: string;
    muscleGroup?: string;
    minDuration?: string;
    maxDuration?: string;
    saved?: string;
  };
}) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 9;
  const search = searchParams.search || "";
  const userId = await getCurrentUserId();

  const filters = {
    equipment: searchParams.equipment,
    muscleGroup: searchParams.muscleGroup,
    minDuration: searchParams.minDuration
      ? parseInt(searchParams.minDuration)
      : undefined,
    maxDuration: searchParams.maxDuration
      ? parseInt(searchParams.maxDuration)
      : undefined,
    saved: searchParams.saved === "true",
  };

  const { workouts, total } = await getWorkouts(
    page,
    pageSize,
    search,
    filters,
    userId!
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
          <p className="text-muted-foreground">
            Choose from our collection of pre-built workouts
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <form className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
            <p className="text-center col-span-full">
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
                    "use server";
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
                  searchParams={searchParams}
                />
              </div>
            </>
          )}
        </Suspense>
      </div>
    </div>
  );
}
