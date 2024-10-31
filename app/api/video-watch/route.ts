import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeUser, unauthorizedResponse } from "@/lib/auth-utils";

export const config = {
  runtime: "edge",
};

export async function POST(request: NextRequest) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Check if the video exists
    const video = await prisma.yogaVideo.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Record the watch event
    await prisma.yogaVideoActivity.create({
      data: {
        userId,
        videoId,
      },
    });

    return NextResponse.json(
      { message: "Watch event recorded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error recording watch event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
