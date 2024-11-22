import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function WorkoutNotFound() {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="mb-4 text-4xl font-bold">Workout Not Found</h1>
      <p className="mb-8 text-xl text-muted-foreground">
        Sorry, we couldn&apos;t find the workout you&apos;re looking for.
      </p>
      <Button asChild>
        <Link href="/workouts">Back to Workouts</Link>
      </Button>
    </div>
  );
}
