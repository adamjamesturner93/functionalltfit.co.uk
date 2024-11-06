import { getWorkoutSummary } from "@/app/actions/workouts";

import { notFound } from "next/navigation";
import { WorkoutSummary } from "./workout-summary";
import { getCurrentUser } from "@/app/actions/profile";

export default async function WorkoutSummaryPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
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
      userId={user.id}
      userPreferences={{
        lengthUnit: user.preferences?.lengthUnit || "METRIC",
        weightUnit: user.preferences?.weightUnit || "METRIC",
      }}
    />
  );
}
