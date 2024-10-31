import { NextRequest, NextResponse } from "next/server";
import { authorizeUser, unauthorizedResponse } from "@/lib/auth-utils";
import { startWorkout } from "@/app/admin/actions/workouts";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const workoutId = params.id;

  if (!workoutId) {
    return NextResponse.json(
      { error: "Workout ID is required" },
      { status: 400 }
    );
  }

  try {
    const combinedWorkout = await startWorkout(workoutId, session.user.id);
    return NextResponse.json(combinedWorkout);
  } catch (error) {
    console.error("Error starting workout:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
