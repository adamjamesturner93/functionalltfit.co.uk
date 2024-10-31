import React from "react";
import Link from "next/link";
import { getExercises, ExerciseFilters } from "@/app/admin/actions/exercises";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { ExerciseSearch } from "./exercise-search";
import { ExercisesTable } from "./exercises-table";
import { ExerciseFilters as ExerciseFiltersComponent } from "./exercise-filters";
import { ExerciseType, ExerciseMode } from "@prisma/client";

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    type?: string;
    mode?: string;
    muscleGroup?: string;
  };
}) {
  const {
    page: pageNumber,
    search: searchParam,
    type: typeFiler,
    mode: modeFilter,
    muscleGroup,
  } = await searchParams;
  const page = Number(pageNumber) || 1;
  const pageSize = 10;
  const search = searchParam || "";
  const filters: ExerciseFilters = {
    type: typeFiler as ExerciseType | "ALL" | undefined,
    mode: modeFilter as ExerciseMode | "ALL" | undefined,
    muscleGroup,
  };

  const { exercises, total } = await getExercises(
    page,
    pageSize,
    search,
    filters
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Exercises</h1>
        <Link href="/admin/content/exercises/new">
          <Button>Create New Exercise</Button>
        </Link>
      </div>
      <Card>
        <CardContent className="mt-6">
          <div className="space-y-4">
            <ExerciseSearch />
            <ExerciseFiltersComponent />
          </div>
          <div className="mt-6">
            <ExercisesTable exercises={exercises} />
          </div>
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalItems={total}
              pageSize={pageSize}
              baseUrl="/admin/content/exercises"
              searchParams={{
                search: search || undefined,
                type: filters.type,
                mode: filters.mode,
                muscleGroup: filters.muscleGroup,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
