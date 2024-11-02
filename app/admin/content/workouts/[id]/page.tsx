import { getWorkoutById } from "@/app/actions/workouts";
import { notFound } from "next/navigation";
import { WorkoutForm } from "./workout-form";

export default async function EditWorkoutPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const workout = id === "new" ? null : await getWorkoutById(id);

  if (id !== "new" && !workout) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">
        {workout ? "Edit Workout" : "Create New Workout"}
      </h1>
      <WorkoutForm workout={workout} />
    </div>
  );
}
