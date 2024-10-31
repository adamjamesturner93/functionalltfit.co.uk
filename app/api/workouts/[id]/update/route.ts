import { NextRequest, NextResponse } from "next/server";
import { authorizeUser, unauthorizedResponse } from "@/lib/auth-utils";
import { updateWorkoutActivity } from "@/app/admin/actions/workouts";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const { sets } = await request.json();

  try {
    const updatedWorkoutActivity = await updateWorkoutActivity(params.id, sets);
    return NextResponse.json(updatedWorkoutActivity);
  } catch (error) {
    console.error("Error updating workout activity:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
