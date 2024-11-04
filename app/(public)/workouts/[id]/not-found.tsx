import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WorkoutNotFound() {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Workout Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Sorry, we couldn&apos;t find the workout you&apos;re looking for.
      </p>
      <Button asChild>
        <Link href="/workouts">Back to Workouts</Link>
      </Button>
    </div>
  );
}
