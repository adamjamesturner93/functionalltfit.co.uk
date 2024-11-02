import { getExerciseById } from "@/app/actions/exercises";
import { notFound } from "next/navigation";
import { ExerciseForm } from "./exercise-form";

export default async function EditWorkoutPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const exercise = id === "new" ? null : await getExerciseById(id);

  if (id !== "new" && !exercise) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">
        {exercise ? "Edit Workout" : "Create New Workout"}
      </h1>
      <ExerciseForm exercise={exercise} />
    </div>
  );
}
