import { Dumbbell, GlassWater, Timer } from 'lucide-react';
import Link from 'next/link';

import { ProgrammeActivityWithName } from '@/app/actions/programmes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function NextWorkoutCard({ activity }: { activity: ProgrammeActivityWithName }) {
  return (
    <Card className="border-primary/20 bg-primary/10 backdrop-blur transition-colors hover:bg-primary/15">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="size-5 text-primary" />
          Next Up: {activity.name}
        </CardTitle>
        <CardDescription>Get ready for your next session!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="mb-2 flex items-center gap-4">
            <Badge>
              Day {activity.day} - {activity.activityType.toLowerCase()}
            </Badge>
            <Badge variant="outline">45 mins</Badge>
            <Badge variant="outline">Equipment needed</Badge>
          </div>
          <div className="flex gap-2">
            {activity.activityType === 'WORKOUT' ? (
              <Dumbbell className="size-4 text-primary" />
            ) : (
              <GlassWater className="size-4 text-primary" />
            )}
            <span className="text-sm text-muted-foreground">
              {activity.activityType === 'WORKOUT' ? 'Dumbbells, Mat' : 'Yoga Mat'}
            </span>
          </div>
          <Button className="w-full" size="lg" asChild>
            <Link
              href={
                activity.activityType === 'WORKOUT'
                  ? `/workouts/${activity.workoutId}`
                  : `/yoga/${activity.yogaVideoId}`
              }
            >
              Start Session
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
