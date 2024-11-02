import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getActivityHistory } from "@/app/actions/activity";
import {
  getUserProgramme,
  ProgrammeActivityWithName,
  UserProgrammeWithProgress,
} from "@/app/actions/programmes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  Dumbbell,
  GlassWater,
  CheckCircle,
  XCircle,
} from "lucide-react";

async function getUserDashboardData(userId: string) {
  const [activityHistory, userProgramme] = await Promise.all([
    getActivityHistory(userId),
    getUserProgramme(userId),
  ]);

  return { activityHistory, userProgramme };
}

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { activityHistory, userProgramme } = await getUserDashboardData(
    session.user.id
  );

  const today = new Date();
  const startDate = userProgramme ? new Date(userProgramme.startDate) : null;

  let currentWeek = 0;
  let thisWeeksSessions: ProgrammeActivityWithName[] = [];

  if (startDate && userProgramme) {
    const daysSinceStart = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    currentWeek = Math.min(
      Math.floor(daysSinceStart / 7) + 1,
      userProgramme.programme.weeks
    );

    thisWeeksSessions = userProgramme.programme.activities.filter(
      (activity) => activity.week === currentWeek
    ) as ProgrammeActivityWithName[];
  }

  const renderProgrammeContent = (userProgramme: UserProgrammeWithProgress) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <Card>
        <CardHeader>
          <CardTitle>
            Active Programme: {userProgramme.programme.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{userProgramme.programme.description}</p>
          <p className="mb-4">
            Current Week: {currentWeek} of {userProgramme.programme.weeks}
          </p>
          <div className="mb-4">
            <Progress value={userProgramme.progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-1">
              {userProgramme.progress.toFixed(1)}% Complete
            </p>
          </div>
          <Button asChild>
            <Link href={`/programmes/${userProgramme.programme.id}`}>
              Continue Programme
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Week {currentWeek} Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {thisWeeksSessions.map((activity) => (
              <li
                key={activity.id}
                className="flex items-center justify-between"
              >
                <Link
                  href={
                    activity.activityType === "WORKOUT"
                      ? `/workouts/${activity.workoutId}`
                      : `/yoga/${activity.yogaVideoId}`
                  }
                  className="flex items-center space-x-2 hover:underline"
                >
                  {activity.activityType === "WORKOUT" ? (
                    <Dumbbell className="h-4 w-4" />
                  ) : (
                    <GlassWater className="h-4 w-4" />
                  )}
                  <span>
                    {activity.name} - Day {activity.day}
                  </span>
                </Link>
                {activity.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Welcome, {session.user.name}</h1>

      {userProgramme ? (
        renderProgrammeContent(userProgramme)
      ) : (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Start Your Fitness Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You haven&apos;t started a programme yet. Choose a programme to
              kickstart your fitness journey!
            </p>
            <Button asChild>
              <Link href="/programmes">Browse Programmes</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="yoga">Yoga</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ul className="space-y-4">
            {activityHistory.slice(0, 5).map((activity) => (
              <li key={activity.id} className="flex items-center space-x-4">
                {activity.type === "workout" ? (
                  <Dumbbell className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <GlassWater className="h-6 w-6 text-muted-foreground" />
                )}
                <div>
                  <p className="font-semibold">{activity.name}</p>
                  <p className="text-sm text-muted-foreground">
                    <CalendarDays className="inline-block mr-1 h-4 w-4" />
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="workouts">
          <ul className="space-y-4">
            {activityHistory
              .filter((activity) => activity.type === "workout")
              .slice(0, 5)
              .map((activity) => (
                <li key={activity.id} className="flex items-center space-x-4">
                  <Dumbbell className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">
                      <CalendarDays className="inline-block mr-1 h-4 w-4" />
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </TabsContent>
        <TabsContent value="yoga">
          <ul className="space-y-4">
            {activityHistory
              .filter((activity) => activity.type === "yoga")
              .slice(0, 5)
              .map((activity) => (
                <li key={activity.id} className="flex items-center space-x-4">
                  <GlassWater className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">
                      <CalendarDays className="inline-block mr-1 h-4 w-4" />
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </TabsContent>
      </Tabs>
    </>
  );
}
