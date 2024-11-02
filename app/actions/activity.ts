"use server";

import { prisma } from "@/lib/prisma";

export type ActivityHistoryItem = {
  id: string;
  type: "workout" | "yoga";
  name: string;
  date: Date;
  duration: number;
};

export async function getActivityHistory(
  userId: string
): Promise<ActivityHistoryItem[]> {
  const workoutActivities = await prisma.workoutActivity.findMany({
    where: { userId },
    include: {
      workout: true,
    },
    orderBy: { startedAt: "desc" },
  });

  const yogaActivities = await prisma.yogaVideoActivity.findMany({
    where: { userId },
    include: {
      yogaVideo: true,
    },
    orderBy: { watchedAt: "desc" },
  });

  const workoutHistory: ActivityHistoryItem[] = workoutActivities.map(
    (activity) => ({
      id: activity.id,
      type: "workout",
      name: activity.workout.name,
      date: activity.startedAt,
      duration: activity.endedAt
        ? Math.round(
            (activity.endedAt.getTime() - activity.startedAt.getTime()) / 60000
          )
        : 0,
    })
  );

  const yogaHistory: ActivityHistoryItem[] = yogaActivities.map((activity) => ({
    id: activity.id,
    type: "yoga",
    name: activity.yogaVideo.title,
    date: activity.watchedAt,
    duration: activity.yogaVideo.duration / 60, // Convert seconds to minutes
  }));

  return [...workoutHistory, ...yogaHistory].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
}
