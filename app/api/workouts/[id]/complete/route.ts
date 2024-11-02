import { NextRequest, NextResponse } from "next/server";
import { authorizeUser, unauthorizedResponse } from "@/lib/auth-utils";
import { completeWorkout } from "@/app/actions/workouts";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const { activityId, exercises } = await request.json();

  try {
    const summary = await completeWorkout(
      activityId,
      params.id,
      exercises,
      session.user.id
    );
    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error completing workout:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
