"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { YogaType, YogaVideo, Prisma } from "@prisma/client";
import { autoUpdateActivityCompletion } from "./programmes";

import { Mux } from "@mux/mux-node";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export type YogaVideoInput = {
  title: string;
  description: string;
  type: YogaType;
  props: string[];
  muxPlaybackId: string;
  muxAssetId: string;
  thumbnailUrl: string;
  duration: number;
};

export type YogaVideoFilters = {
  type?: YogaType;
  props?: string[];
  duration?: "less15" | "15to30" | "30to45" | "45plus";
  savedOnly?: boolean;
};

export type YogaVideoSortOption = "newest" | "mostViewed" | "leastViewed";

export type YogaVideoWithWatchCountAndSaved = YogaVideo & {
  watchCount: number;
  isSaved: boolean;
};

export async function getYogaVideos(
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  filters: YogaVideoFilters = {},
  sort: YogaVideoSortOption = "newest",
  userId?: string | null
): Promise<{ yogaVideos: YogaVideoWithWatchCountAndSaved[]; total: number }> {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: Prisma.YogaVideoWhereInput = {};

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

  if (filters.savedOnly && userId) {
    where.savedBy = {
      some: {
        userId: userId,
      },
    };
  }

  const orderBy: Prisma.YogaVideoOrderByWithRelationInput =
    sort === "newest"
      ? { createdAt: "desc" }
      : sort === "mostViewed"
      ? { activities: { _count: "desc" } }
      : { activities: { _count: "asc" } };

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
        savedBy: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
      },
    }),
    prisma.yogaVideo.count({ where }),
  ]);

  return {
    yogaVideos: yogaVideos.map((video) => ({
      ...video,
      watchCount: video._count.activities,
      isSaved: userId ? video.savedBy.length > 0 : false,
      savedBy: undefined, // Remove savedBy from the response
    })),
    total,
  };
}
export async function getYogaVideoById(
  id: string,
  userId?: string | null
): Promise<YogaVideoWithWatchCountAndSaved | null> {
  const yogaVideo = await prisma.yogaVideo.findUnique({
    where: { id },
    include: {
      _count: {
        select: { activities: true },
      },
      savedBy: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
  });

  if (!yogaVideo) return null;

  return {
    ...yogaVideo,
    watchCount: yogaVideo._count.activities,
    isSaved: userId ? yogaVideo.savedBy.length > 0 : false,
  };
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

export async function deleteMuxAsset(assetId: string) {
  try {
    await video.assets.delete(assetId);
  } catch (error) {
    console.error("Error deleting Mux asset:", error);
    throw new Error("Failed to delete Mux asset");
  }
}

export async function deleteYogaVideo(id: string) {
  const yogaVideo = await prisma.yogaVideo.findUnique({ where: { id } });
  if (yogaVideo) {
    await deleteMuxAsset(yogaVideo.muxAssetId);
  }
  await prisma.yogaVideo.delete({ where: { id } });
  revalidatePath("/admin/content/yoga-videos");
}

export async function completeYogaVideo(userId: string, yogaVideoId: string) {
  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the yoga video exists
    const yogaVideo = await prisma.yogaVideo.findUnique({
      where: { id: yogaVideoId },
    });

    if (!yogaVideo) {
      throw new Error("Yoga video not found");
    }

    // Create a new yoga video activity
    await prisma.yogaVideoActivity.create({
      data: {
        userId,
        videoId: yogaVideoId,
        watchedAt: new Date(),
      },
    });

    // Update the programme activity if it's part of a programme
    await autoUpdateActivityCompletion(userId, "YOGA", yogaVideoId);

    revalidatePath("/dashboard");
    revalidatePath("/yoga");

    return { success: true, message: "Yoga video completed successfully" };
  } catch (error) {
    console.error("Error completing yoga video:", error);
    throw error;
  }
}

export async function getYogaVideoCompletions(
  userId: string,
  yogaVideoId: string
) {
  try {
    const completions = await prisma.yogaVideoActivity.findMany({
      where: {
        userId,
        videoId: yogaVideoId,
      },
      orderBy: {
        watchedAt: "desc",
      },
    });

    return completions;
  } catch (error) {
    console.error("Error fetching yoga video completions:", error);
    throw error;
  }
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
  const filledStats = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split("T")[0];
    const existingStat = stats.find((stat) => stat.date === dateString);

    if (existingStat) {
      filledStats.push(existingStat);
    } else {
      filledStats.push({ date: dateString, views: 0 });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledStats;
}

export async function getYogaFilterOptions() {
  const yogaTypes = Object.values(YogaType);

  const props = await prisma.yogaVideo.findMany({
    select: {
      props: true,
    },
    distinct: ["props"],
  });

  const uniqueProps = Array.from(new Set(props.flatMap((p) => p.props)));

  return {
    types: yogaTypes,
    props: uniqueProps,
  };
}

export async function toggleYogaVideoSave(yogaVideoId: string, userId: string) {
  const existingSave = await prisma.userYogaVideoSave.findUnique({
    where: {
      userId_yogaVideoId: {
        userId,
        yogaVideoId,
      },
    },
  });

  if (existingSave) {
    await prisma.userYogaVideoSave.delete({
      where: {
        id: existingSave.id,
      },
    });
  } else {
    await prisma.userYogaVideoSave.create({
      data: {
        userId,
        yogaVideoId,
      },
    });
  }

  revalidatePath("/yoga");
  revalidatePath(`/yoga/${yogaVideoId}`);
}
