import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Clock,
  Dumbbell,
  Target,
  ArrowLeft,
  BookmarkIcon,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getWorkoutById, toggleWorkoutSave } from "@/app/actions/workouts";
import { WorkoutStructure } from "./workout-structure";
import { getCurrentUserId } from "@/lib/auth-utils";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const userId = await getCurrentUserId();
  const workout = await getWorkoutById(params.id, userId);

  if (!workout) {
    return {
      title: "Workout Not Found",
    };
  }

  return {
    title: `${workout.name} | FunctionallyFit`,
    description: workout.description,
  };
}

export default async function WorkoutPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = await getCurrentUserId();
  const workout = await getWorkoutById(params.id, userId);

  if (!workout) {
    notFound();
  }

  async function handleToggleSave() {
    "use server";
    if (userId) {
      await toggleWorkoutSave(params.id, userId);
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <Link
            href="/workouts"
            className="inline-flex items-center text-sm mb-4 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workouts
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {workout.name}
          </h1>
          <p className="text-muted-foreground">{workout.description}</p>
        </div>
        <div className="flex gap-2">
          {userId && (
            <form action={handleToggleSave}>
              <Button variant="secondary" size="sm">
                <BookmarkIcon
                  className={`h-4 w-4 mr-2 ${
                    workout.isSaved ? "fill-current" : ""
                  }`}
                />
                {workout.isSaved ? "Saved" : "Save Workout"}
              </Button>
            </form>
          )}
          <Button asChild size="sm">
            <Link href={`/workouts/${params.id}/start`}>
              <Play className="mr-2 h-4 w-4" />
              Start Workout
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>{Math.floor(workout.totalLength / 60)} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-muted-foreground" />
            <span>{workout.equipment.join(", ") || "No equipment needed"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-muted-foreground" />
            <span>{workout.muscleGroups.join(", ")}</span>
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
