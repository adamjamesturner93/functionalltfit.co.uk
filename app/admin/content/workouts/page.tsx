import React from "react";
import Link from "next/link";
import { getWorkouts, WorkoutFilters } from "@/app/admin/actions/workouts";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { WorkoutSearch } from "./workout-search";
import { WorkoutsTable } from "./workout-table";
import { WorkoutFilters as WorkoutFiltersComponent } from "./workout-filters";

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
  };
}) {
  const {
    page: pageNumber,
    search: searchParam,
    equipment,
    muscleGroup,
    minDuration,
    maxDuration,
  } = await searchParams;
  const page = Number(pageNumber) || 1;
  const pageSize = 10;
  const search = searchParam || "";
  const filters: WorkoutFilters = {
    equipment,
    muscleGroup,
    minDuration: minDuration ? parseInt(minDuration) : undefined,
    maxDuration: maxDuration ? parseInt(maxDuration) : undefined,
  };

  const { workouts, total } = await getWorkouts(
    page,
    pageSize,
    search,
    filters
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <Link href="/admin/content/workouts/new">
          <Button>Create New Workout</Button>
        </Link>
      </div>
      <Card>
        <CardContent className="mt-6">
          <div className="space-y-4">
            <WorkoutSearch />
            <WorkoutFiltersComponent />
          </div>
          <div className="mt-6">
            <WorkoutsTable workouts={workouts} />
          </div>
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalItems={total}
              pageSize={pageSize}
              baseUrl="/admin/content/workouts"
              searchParams={{
                search: search || undefined,
                equipment,
                muscleGroup,
                minDuration,
                maxDuration,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
