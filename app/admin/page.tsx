import { Clipboard, Dumbbell, Users, Video } from 'lucide-react';

import { getUsers } from '@/app/actions/users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getExercises } from '../actions/exercises';
import { getWorkouts } from '../actions/workouts';
import { getYogaVideos } from '../actions/yoga-videos';

export default async function Dashboard() {
  const { total: totalMembers } = await getUsers();
  const { total: totalYogaVideos } = await getYogaVideos();
  const { total: totalExercises } = await getExercises();
  const { total: totalWorkouts } = await getWorkouts();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yoga Videos</CardTitle>
            <Video className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalYogaVideos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercises</CardTitle>
            <Dumbbell className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExercises}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workouts</CardTitle>
            <Clipboard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkouts}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
