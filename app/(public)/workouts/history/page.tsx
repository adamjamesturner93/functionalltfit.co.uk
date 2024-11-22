import Link from 'next/link';

import { CompletedWorkout, getCompletedWorkouts } from '@/app/actions/workouts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function WorkoutHistoryPage() {
  const completedWorkouts: CompletedWorkout[] = await getCompletedWorkouts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Workout History</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {completedWorkouts.map((workout) => (
          <Link href={`/workouts/${workout.id}/summary`} key={workout.id}>
            <Card className="cursor-pointer transition-colors hover:bg-slate-100">
              <CardHeader>
                <CardTitle>{workout.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Completed: {new Date(workout.completedAt).toLocaleDateString()}</p>
                <p>Duration: {Math.round(workout.totalDuration / 60)} minutes</p>
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
