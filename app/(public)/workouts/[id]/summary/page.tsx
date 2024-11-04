import { getWorkoutSummary } from "@/app/actions/workouts";

import { getCurrentUserId } from "@/lib/auth-utils";
import { notFound } from "next/navigation";
import { WorkoutSummary } from "../start/workout-summary";

export default async function WorkoutSummaryPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = await getCurrentUserId();
  if (!userId) {
    notFound();
  }

  const summary = await getWorkoutSummary(params.id);
  if (!summary) {
    notFound();
  }

  return (
    <WorkoutSummary
      summary={summary}
      workoutActivityId={params.id}
      userId={userId}
    />
  );
}
