/*
  Warnings:

  - You are about to drop the column `muscleGroups` on the `Workout` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Workout_muscleGroups_idx";

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "muscleGroups",
ADD COLUMN     "cooldown" JSONB,
ADD COLUMN     "primaryMuscles" TEXT[],
ADD COLUMN     "warmup" JSONB;

-- CreateIndex
CREATE INDEX "Workout_primaryMuscles_idx" ON "Workout"("primaryMuscles");
