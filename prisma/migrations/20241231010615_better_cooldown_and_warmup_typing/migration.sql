/*
  Warnings:

  - You are about to drop the column `cooldown` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `warmup` on the `Workout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "cooldown",
DROP COLUMN "warmup";

-- CreateTable
CREATE TABLE "WarmupExercise" (
    "id" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "WarmupExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CooldownExercise" (
    "id" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "CooldownExercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WarmupExercise_workoutId_idx" ON "WarmupExercise"("workoutId");

-- CreateIndex
CREATE INDEX "WarmupExercise_exerciseId_idx" ON "WarmupExercise"("exerciseId");

-- CreateIndex
CREATE INDEX "CooldownExercise_workoutId_idx" ON "CooldownExercise"("workoutId");

-- CreateIndex
CREATE INDEX "CooldownExercise_exerciseId_idx" ON "CooldownExercise"("exerciseId");

-- AddForeignKey
ALTER TABLE "WarmupExercise" ADD CONSTRAINT "WarmupExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarmupExercise" ADD CONSTRAINT "WarmupExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CooldownExercise" ADD CONSTRAINT "CooldownExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CooldownExercise" ADD CONSTRAINT "CooldownExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
