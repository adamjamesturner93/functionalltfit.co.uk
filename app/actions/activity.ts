import { prisma } from '@/lib/prisma';

export type ActivityHistoryItem = {
  id: string;
  type: 'workout' | 'yoga';
  name: string;
  date: Date;
  duration: number;
};

export async function getActivityHistory(
  userId: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<{ activities: ActivityHistoryItem[]; total: number }> {
  const skip = (page - 1) * pageSize;

  const [workoutActivities, yogaActivities, totalWorkouts, totalYoga] = await Promise.all([
    prisma.workoutActivity.findMany({
      where: { userId },
      include: { workout: true },
      orderBy: { startedAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.yogaVideoActivity.findMany({
      where: { userId },
      include: { yogaVideo: true },
      orderBy: { watchedAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.workoutActivity.count({ where: { userId } }),
    prisma.yogaVideoActivity.count({ where: { userId } }),
  ]);

  const workoutHistory: ActivityHistoryItem[] = workoutActivities.map((activity) => ({
    id: activity.id,
    type: 'workout',
    name: activity.workout.name,
    date: activity.startedAt,
    duration: activity.endedAt
      ? Math.round((activity.endedAt.getTime() - activity.startedAt.getTime()) / 60000)
      : 0,
  }));

  const yogaHistory: ActivityHistoryItem[] = yogaActivities.map((activity) => ({
    id: activity.id,
    type: 'yoga',
    name: activity.yogaVideo.title,
    date: activity.watchedAt,
    duration: activity.yogaVideo.duration / 60, // Convert seconds to minutes
  }));

  const activities = [...workoutHistory, ...yogaHistory].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
  const total = totalWorkouts + totalYoga;

  return { activities, total };
}
