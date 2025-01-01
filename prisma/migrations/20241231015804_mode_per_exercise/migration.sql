/*
  Warnings:

  - Added the required column `mode` to the `SetExercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SetExercise" ADD COLUMN     "mode" "ExerciseMode" NOT NULL,
ADD COLUMN     "targetDistance" DOUBLE PRECISION,
ADD COLUMN     "targetTime" INTEGER,
ALTER COLUMN "targetReps" DROP NOT NULL;
