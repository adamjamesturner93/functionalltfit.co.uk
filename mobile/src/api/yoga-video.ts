import { api } from "./client";

export interface YogaVideo {
  id: string;
  title: string;
  description: string;
  type: "MINDFULNESS" | "BUILD" | "EXPLORE";
  props: string[];
  duration: number;
  thumbnailUrl: string;
  videoUrl: string;
  viewCount: number;
}

export const fetchYogaVideos = async (): Promise<YogaVideo[]> => {
  try {
    const response = await api.get("/api/yoga-videos");
    return response.data;
  } catch (error) {
    console.error("Error fetching yoga videos:", error);
    throw error;
  }
};
