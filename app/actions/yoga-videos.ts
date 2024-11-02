"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { YogaType, YogaVideo } from "@prisma/client";

export type YogaVideoInput = {
  title: string;
  description: string;
  type: YogaType;
  props: string[];
  url: string;
  thumbnailUrl: string;
  duration: number;
};

export type YogaVideoFilters = {
  type?: YogaType;
  props?: string[];
  duration?: "less15" | "15to30" | "30to45" | "45plus";
};

export type YogaVideoSortOption = "newest" | "mostViewed" | "leastViewed";

export type YogaVideoWithWatchCount = YogaVideo & { watchCount: number };

export async function getYogaVideos(
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  filters: YogaVideoFilters = {},
  sort: YogaVideoSortOption = "newest"
): Promise<{ yogaVideos: YogaVideoWithWatchCount[]; total: number }> {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.props && filters.props.length > 0) {
    where.props = {
      hasEvery: filters.props,
    };
  }

  if (filters.duration) {
    switch (filters.duration) {
      case "less15":
        where.duration = { lt: 15 * 60 };
        break;
      case "15to30":
        where.duration = { gte: 15 * 60, lt: 30 * 60 };
        break;
      case "30to45":
        where.duration = { gte: 30 * 60, lt: 45 * 60 };
        break;
      case "45plus":
        where.duration = { gte: 45 * 60 };
        break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any;

  switch (sort) {
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "mostViewed":
      orderBy = { activities: { _count: "desc" } };
      break;
    case "leastViewed":
      orderBy = { activities: { _count: "asc" } };
      break;
  }

  const [yogaVideos, total] = await Promise.all([
    prisma.yogaVideo.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        _count: {
          select: { activities: true },
        },
      },
    }),
    prisma.yogaVideo.count({ where }),
  ]);

  return {
    yogaVideos: yogaVideos.map((video) => ({
      ...video,
      watchCount: video._count.activities,
    })),
    total,
  };
}

export async function getYogaVideoById(id: string): Promise<YogaVideo | null> {
  return prisma.yogaVideo.findUnique({
    where: { id },
  });
}

export async function createYogaVideo(data: YogaVideoInput) {
  const yogaVideo = await prisma.yogaVideo.create({ data });
  revalidatePath("/admin/content/yoga-videos");
  return yogaVideo;
}

export async function updateYogaVideo(
  id: string,
  data: Partial<YogaVideoInput>
) {
  const yogaVideo = await prisma.yogaVideo.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/content/yoga-videos");
  return yogaVideo;
}

export async function deleteYogaVideo(id: string) {
  await prisma.yogaVideo.delete({ where: { id } });
  revalidatePath("/admin/content/yoga-videos");
}

export async function fetchViewStats(
  id: string,
  timeFrame: "week" | "month" | "6months"
) {
  const startDate = new Date();
  switch (timeFrame) {
    case "week":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "6months":
      startDate.setMonth(startDate.getMonth() - 6);
      break;
  }

  try {
    const viewStats = await prisma.yogaVideoActivity.groupBy({
      by: ["watchedAt"],
      where: {
        videoId: id,
        watchedAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        watchedAt: "asc",
      },
    });

    // Create a map to combine views for the same date
    const viewsByDate = new Map<string, number>();

    viewStats.forEach((stat) => {
      const date = stat.watchedAt.toISOString().split("T")[0];
      const currentViews = viewsByDate.get(date) || 0;
      viewsByDate.set(date, currentViews + stat._count.id);
    });

    // Convert the map back to an array of objects
    const formattedStats = Array.from(viewsByDate.entries()).map(
      ([date, views]) => ({
        date,
        views,
      })
    );

    // Sort by date
    formattedStats.sort((a, b) => a.date.localeCompare(b.date));

    // Fill in missing dates with zero views
    const filledStats = fillMissingDates(formattedStats, startDate, new Date());

    return filledStats;
  } catch (error) {
    console.error("Error fetching view stats:", error);
    return [];
  }
}

// Helper function to fill in missing dates with zero views
function fillMissingDates(
  stats: { date: string; views: number }[],
  startDate: Date,
  endDate: Date
) {
  const filledStats: { date: string; views: number }[] = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  // Create a map of existing stats for easy lookup
  const statsMap = new Map(stats.map((stat) => [stat.date, stat.views]));

  while (currentDate <= end) {
    const dateString = currentDate.toISOString().split("T")[0];
    filledStats.push({
      date: dateString,
      views: statsMap.get(dateString) || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledStats;
}
