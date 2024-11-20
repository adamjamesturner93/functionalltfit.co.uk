import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart3,
  CalendarDays,
  ChevronRight,
  Dumbbell,
  Flame,
  GlassWater,
  Plus,
  Ruler,
  Target,
  Trophy,
  Weight,
  Heart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BodyMeasurementGraph } from '../components/body-measurement-graph';
import { QuickAddForm } from '../components/quick-add-form';
import { GoalsSection } from '../components/goals/goals-section';
import { QuickStatsCard } from '../components/quick-stats-card';
import {
  getUserProgramme,
  ProgrammeActivityWithName,
  UserProgrammeWithProgress,
} from '@/app/actions/programmes';
import { getBodyMeasurements } from '@/app/actions/health';
import { getActiveGoals } from '@/app/actions/goals';
import { Suspense } from 'react';
import { NextWorkoutCard } from '../components/next-workout-card';

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const [userProgramme, bodyMeasurements, activeGoals] = await Promise.all([
    getUserProgramme(session.user.id),
    getBodyMeasurements(session.user.id, 30),
    getActiveGoals(session.user.id),
  ]);

  const today = new Date();
  const startDate = userProgramme ? new Date(userProgramme.startDate) : null;

  let currentWeek = 0;
  let thisWeeksSessions: ProgrammeActivityWithName[] = [];
  let nextSession: ProgrammeActivityWithName | null = null;

  if (startDate && userProgramme) {
    const daysSinceStart = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    currentWeek = Math.min(Math.floor(daysSinceStart / 7) + 1, userProgramme.programme.weeks);

    thisWeeksSessions = userProgramme.programme.activities.filter(
      (activity) => activity.week === currentWeek,
    ) as ProgrammeActivityWithName[];

    nextSession = thisWeeksSessions.find((activity) => !activity.completed) || null;
  }

  const renderProgrammeContent = (userProgramme: UserProgrammeWithProgress) => (
    <Card className="bg-card/50 backdrop-blur transition-colors hover:bg-card/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Active Programme
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="mb-1 font-semibold">{userProgramme.programme.title}</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {userProgramme.programme.description}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Week {currentWeek} of {userProgramme.programme.weeks}
              </span>
              <span>{userProgramme.progress.toFixed(1)}% Complete</span>
            </div>
            <Progress value={userProgramme.progress} className="h-2" />
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/programmes/${userProgramme.programme.id}`}>View Programme Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold">Welcome back, {session.user.name}</h1>
          <p className="text-muted-foreground">
            {nextSession
              ? 'Your next session is ready - keep up the momentum!'
              : 'Track your progress and stay on top of your fitness journey'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <QuickStatsCard
          title="Weekly Streak"
          value="3 weeks"
          icon={Flame}
          trend={{ value: 50, label: 'vs last month' }}
        />
        <QuickStatsCard
          title="Sessions Completed"
          value="12"
          icon={Trophy}
          trend={{ value: 20, label: 'vs last month' }}
        />
        <QuickStatsCard
          title="Current Weight"
          value={`${bodyMeasurements[bodyMeasurements.length - 1]?.weight || 0} kg`}
          icon={Weight}
          trend={{
            value:
              bodyMeasurements.length > 1
                ? (((bodyMeasurements[bodyMeasurements.length - 1]?.weight || 0) -
                    (bodyMeasurements[0]?.weight || 0)) /
                    (bodyMeasurements[0]?.weight || 1)) *
                  100
                : 0,
            label: 'last 30 days',
          }}
        />
        <QuickStatsCard
          title="Programme Progress"
          value={`${userProgramme?.progress.toFixed(1) || 0}%`}
          icon={Target}
        />
      </div>

      {nextSession && <NextWorkoutCard activity={nextSession} />}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {userProgramme ? (
          renderProgrammeContent(userProgramme)
        ) : (
          <Card className="bg-card/50 backdrop-blur transition-colors hover:bg-card/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Start Your Fitness Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                You haven&apos;t started a programme yet. Choose a programme to kickstart your
                fitness journey!
              </p>
              <Button asChild>
                <Link href="/programmes">Browse Programmes</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {userProgramme && (
          <Card className="bg-card/50 backdrop-blur transition-colors hover:bg-card/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Week {currentWeek} Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {thisWeeksSessions.map((activity) => (
                  <li
                    key={activity.id}
                    className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50"
                  >
                    <Link
                      href={
                        activity.activityType === 'WORKOUT'
                          ? `/workouts/${activity.workoutId}`
                          : `/yoga/${activity.yogaVideoId}`
                      }
                      className="flex flex-1 items-center space-x-2 hover:underline"
                    >
                      {activity.activityType === 'WORKOUT' ? (
                        <Dumbbell className="h-4 w-4 text-primary" />
                      ) : (
                        <GlassWater className="h-4 w-4 text-primary" />
                      )}
                      <span>
                        {activity.name} - Day {activity.day}
                      </span>
                    </Link>
                    <Badge variant={activity.completed ? 'default' : 'secondary'} className="ml-2">
                      {activity.completed ? 'Completed' : 'Pending'}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <GoalsSection goals={activeGoals} />
        </Suspense>

        <Card className="bg-card/50 backdrop-blur transition-colors hover:bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" />
                Body Measurement Trends
              </CardTitle>
              <CardDescription>Track your progress over time</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Quick Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Quick Add</DialogTitle>
                    <DialogDescription>Quickly log your body measurements</DialogDescription>
                  </DialogHeader>
                  <QuickAddForm />
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/health/measurements">
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">View all measurements</span>
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <BodyMeasurementGraph data={bodyMeasurements} />
            </Suspense>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" asChild>
                <Link href="/health/measurements" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Detailed Analytics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
