import { getWorkoutById } from "@/app/actions/workouts";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  const workout = await getWorkoutById(id);
  if (!workout) return { title: "Workout Not Found" };

  return {
    title: `${workout.name} | Functional Fitness Workout`,
    description: workout.description,
  };
}

export default async function WorkoutPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const workout = await getWorkoutById(id);

  if (!workout) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{workout.name}</CardTitle>
          <CardDescription>{workout.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            {workout.muscleGroups.map((group) => (
              <Badge key={group} variant="secondary">
                {group}
              </Badge>
            ))}
          </div>
          <div className="grid gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{Math.floor(workout.totalLength / 60)} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              <span>Equipment: {workout.equipment.join(", ")}</span>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Workout Structure</h3>
            {workout.sets.map((set, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Set {index + 1}: {set.type}
                  </CardTitle>
                  <CardDescription>
                    {set.rounds} rounds, {set.rest} seconds rest
                    {set.gap && `, ${set.gap} seconds gap`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside">
                    {set.exercises.map((exercise, exIndex) => (
                      <li key={exIndex}>
                        {exercise.exercise.name} - {exercise.targetReps} reps
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/workouts/${id}/start`}>Start Workout</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
