import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CompletedWorkout, getCompletedWorkouts } from "@/app/actions/workouts";

export default async function WorkoutHistoryPage() {
  const completedWorkouts: CompletedWorkout[] = await getCompletedWorkouts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Workout History</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {completedWorkouts.map((workout) => (
          <Link href={`/workouts/${workout.id}/summary`} key={workout.id}>
            <Card className="cursor-pointer hover:bg-slate-100 transition-colors">
              <CardHeader>
                <CardTitle>{workout.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Completed:{" "}
                  {new Date(workout.completedAt).toLocaleDateString()}
                </p>
                <p>
                  Duration: {Math.round(workout.totalDuration / 60)} minutes
                </p>
                <p>Total Weight: {workout.totalWeightLifted.toFixed(1)} kg</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Button asChild className="mt-8">
        <Link href="/workouts">Back to Workouts</Link>
      </Button>
    </div>
  );
}
