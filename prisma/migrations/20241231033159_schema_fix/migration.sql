/*
  Warnings:

  - Added the required column `mode` to the `WorkoutActivityExercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkoutActivityExercise" ADD COLUMN     "mode" "ExerciseMode" NOT NULL;
