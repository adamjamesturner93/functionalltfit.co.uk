import { NextRequest, NextResponse } from "next/server";
import { authorizeUser, unauthorizedResponse } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await authorizeUser(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const { exerciseId, newWeight } = await request.json();

  try {
    const userExerciseWeight = await prisma.userExerciseWeight.upsert({
      where: {
        userId_workoutId_exerciseId: {
          userId: session.user.id,
          workoutId: params.id,
          exerciseId: exerciseId,
        },
      },
      update: {
        weight: newWeight,
      },
      create: {
        userId: session.user.id,
        workoutId: params.id,
        exerciseId: exerciseId,
        weight: newWeight,
      },
    });

    return NextResponse.json(userExerciseWeight);
  } catch (error) {
    console.error("Error updating exercise weight:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
