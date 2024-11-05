import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Dumbbell,
  Target,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProgramme, getUserProgramme } from "@/app/actions/programmes";
import { getCurrentUserId } from "@/lib/auth-utils";
import { ProgrammeActions } from "./programme-actions";

interface Props {
  params: {
    id: string;
  };
}

export default async function ProgrammePage({ params }: Props) {
  const userId = await getCurrentUserId();
  const [programme, activeProgramme] = await Promise.all([
    getProgramme(params.id, userId!),
    userId ? getUserProgramme(userId) : null,
  ]);

  if (!programme) {
    return <div>Programme not found</div>;
  }

  const isActive = activeProgramme?.programme.id === params.id;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/programmes"
          className="flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Programmes
        </Link>
        <ProgrammeActions
          programmeId={params.id}
          userId={userId}
          isSaved={programme.isSaved}
          isActive={isActive}
        />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{programme.title}</h1>
        <p className="text-muted-foreground">{programme.description}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <Calendar className="h-6 w-6 text-primary mb-2" />
            <p className="text-sm font-medium">{programme.weeks} weeks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <Clock className="h-6 w-6 text-primary mb-2" />
            <p className="text-sm font-medium">
              {programme.sessionsPerWeek} sessions/week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <Target className="h-6 w-6 text-primary mb-2" />
            <p className="text-sm font-medium">{programme.intention}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <BarChart className="h-6 w-6 text-primary mb-2" />
            <p className="text-sm font-medium">
              {programme.activities.some((a) => a.activityType === "WORKOUT") &&
              programme.activities.some((a) => a.activityType === "YOGA")
                ? "Mixed"
                : programme.activities[0]?.activityType || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Equipment Needed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {programme.activities.some(
              (a) => a.workout?.equipment?.length || 0 > 0
            ) ? (
              Array.from(
                new Set(
                  programme.activities
                    .flatMap((a) => a.workout?.equipment || [])
                    .filter(Boolean)
                )
              ).map((equipment) => (
                <Badge key={equipment} variant="secondary">
                  {equipment}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">
                No equipment required
              </span>
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
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">Day {activity.day}</Badge>
                        {isActive && activity.completed && (
                          <Badge variant="secondary">Completed</Badge>
                        )}
                      </div>
                      <h3 className="font-medium mb-1">
                        {activity.workout?.name || activity.yogaVideo?.title}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <span className="capitalize mr-2">
                          {activity.activityType.toLowerCase()}
                        </span>
                        <span>•</span>
                        <span className="ml-2">
                          {activity.activityType === "WORKOUT" &&
                          activity.workout
                            ? `${Math.floor(
                                activity.workout.totalLength / 60
                              )} mins`
                            : activity.activityType === "YOGA" &&
                              activity.yogaVideo
                            ? `${Math.floor(
                                activity.yogaVideo.duration / 60
                              )} mins`
                            : "Duration not available"}
                        </span>
                      </div>
                      <Button variant="outline" className="w-full" asChild>
                        <Link
                          href={
                            activity.activityType === "WORKOUT"
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
