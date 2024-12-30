/*
  Warnings:

  - The values [FLEXIBILITY,BALANCE] on the enum `ExerciseType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `muscleGroups` on the `Exercise` table. All the data in the column will be lost.
  - The `equipment` column on the `Exercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExerciseType_new" AS ENUM ('STRENGTH', 'CARDIO', 'STATIC_STRETCH', 'DYNAMIC_STRETCH', 'MOBILITY');
ALTER TABLE "Exercise" ALTER COLUMN "type" TYPE "ExerciseType_new" USING ("type"::text::"ExerciseType_new");
ALTER TYPE "ExerciseType" RENAME TO "ExerciseType_old";
ALTER TYPE "ExerciseType_new" RENAME TO "ExerciseType";
DROP TYPE "ExerciseType_old";
COMMIT;

-- DropIndex
DROP INDEX "Exercise_muscleGroups_idx";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "muscleGroups",
ADD COLUMN     "contraindications" TEXT[],
ADD COLUMN     "muscleGroupCategories" TEXT[],
ADD COLUMN     "primaryMuscles" TEXT[],
ADD COLUMN     "secondaryMuscles" TEXT[],
DROP COLUMN "equipment",
ADD COLUMN     "equipment" TEXT[];

-- CreateIndex
CREATE INDEX "Exercise_primaryMuscles_idx" ON "Exercise"("primaryMuscles");

-- CreateIndex
CREATE INDEX "Exercise_muscleGroupCategories_idx" ON "Exercise"("muscleGroupCategories");

-- CreateIndex
CREATE INDEX "Exercise_contraindications_idx" ON "Exercise"("contraindications");

-- CreateIndex
CREATE INDEX "Exercise_equipment_idx" ON "Exercise"("equipment");
