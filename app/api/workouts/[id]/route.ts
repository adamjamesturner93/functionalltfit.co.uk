import { NextRequest, NextResponse } from "next/server";
import { authorizeUser, unauthorizedResponse } from "@/lib/auth-utils";
import { getWorkoutById } from "@/app/admin/actions/workouts";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const workout = await getWorkoutById(params.id);
    return NextResponse.json(workout);
  } catch (error) {
    console.error("Error fetching workout:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
