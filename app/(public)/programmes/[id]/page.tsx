import { ArrowLeft, BarChart, Calendar, Clock, Dumbbell, Target } from 'lucide-react';
import Link from 'next/link';

import { getProgramme, getUserProgramme } from '@/app/actions/programmes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUserId } from '@/lib/auth-utils';

import { ProgrammeActions } from './programme-actions';

type Params = Promise<{ id: string }>;

export default async function ProgrammePage({ params }: { params: Params }) {
  const userId = await getCurrentUserId();
  const { id } = await params;
  const [programme, activeProgramme] = await Promise.all([
    getProgramme(id, userId!),
    userId ? getUserProgramme(userId) : null,
  ]);

  if (!programme) {
    return <div className="container mx-auto p-6 text-center">Programme not found</div>;
  }

  const isActive = activeProgramme?.programme.id === id;

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex-col items-center justify-between space-y-2 lg:flex-row">
        <Link
          href="/programmes"
          className="flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          <span>Back to Programmes</span>
        </Link>
        <ProgrammeActions
          programmeId={id}
          userId={userId}
          isSaved={programme.isSaved}
          isActive={isActive}
        />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{programme.title}</h1>
        <p className="text-muted-foreground">{programme.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <Calendar className="mb-2 size-6 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium">{programme.weeks} weeks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <Clock className="mb-2 size-6 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium">{programme.sessionsPerWeek} sessions/week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <Target className="mb-2 size-6 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium">{programme.intention}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <BarChart className="mb-2 size-6 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium">
              {programme.activities.some((a) => a.activityType === 'WORKOUT') &&
              programme.activities.some((a) => a.activityType === 'YOGA')
                ? 'Mixed'
                : programme.activities[0]?.activityType || 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="size-5" aria-hidden="true" />
            Equipment Needed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {programme.activities.some((a) => a.workout?.equipment?.length || 0 > 0) ? (
              Array.from(
                new Set(
                  programme.activities.flatMap((a) => a.workout?.equipment || []).filter(Boolean),
                ),
              ).map((equipment) => (
                <Badge key={equipment} variant="secondary">
                  {equipment}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">No equipment required</span>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {Array.from({ length: programme.weeks }, (_, weekIndex) => (
          <div key={weekIndex} className="space-y-4">
            <h2 className="text-xl font-semibold">Week {weekIndex + 1}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {programme.activities
                .filter((activity) => activity.week === weekIndex + 1)
                .sort((a, b) => a.day - b.day)
                .map((activity) => (
                  <Card key={activity.id}>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <Badge variant="outline">Day {activity.day}</Badge>
                        {isActive && activity.completed && (
                          <Badge variant="secondary">Completed</Badge>
                        )}
                      </div>
                      <h3 className="mb-1 font-medium">
                        {activity.workout?.name || activity.yogaVideo?.title}
                      </h3>
                      <div className="mb-4 flex items-center text-sm text-muted-foreground">
                        <span className="mr-2 capitalize">
                          {activity.activityType.toLowerCase()}
                        </span>
                        <span aria-hidden="true">•</span>
                        <span className="ml-2">
                          {activity.activityType === 'WORKOUT' && activity.workout
                            ? `${Math.floor(activity.workout.totalLength / 60)} mins`
                            : activity.activityType === 'YOGA' && activity.yogaVideo
                              ? `${Math.floor(activity.yogaVideo.duration / 60)} mins`
                              : 'Duration not available'}
                        </span>
                      </div>
                      <Button variant="outline" className="w-full" asChild>
                        <Link
                          href={
                            activity.activityType === 'WORKOUT'
                              ? `/workouts/${activity.workout?.id}`
                              : `/yoga/${activity.yogaVideo?.id}`
                          }
                        >
                          View Details
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
