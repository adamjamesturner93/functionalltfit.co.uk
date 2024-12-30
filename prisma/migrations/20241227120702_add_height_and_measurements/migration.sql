/*
  Warnings:

  - You are about to drop the `BodyMeasurement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BodyMeasurement" DROP CONSTRAINT "BodyMeasurement_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "height" DOUBLE PRECISION;

-- DropTable
DROP TABLE "BodyMeasurement";

-- CreateTable
CREATE TABLE "Measurement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" DOUBLE PRECISION,
    "calfCircumference" DOUBLE PRECISION,
    "thighCircumference" DOUBLE PRECISION,
    "buttCircumference" DOUBLE PRECISION,
    "hipsCircumference" DOUBLE PRECISION,
    "waistCircumference" DOUBLE PRECISION,
    "stomachCircumference" DOUBLE PRECISION,
    "chestCircumference" DOUBLE PRECISION,
    "upperArmCircumference" DOUBLE PRECISION,
    "bodyFatPercentage" DOUBLE PRECISION,
    "bodyFatMass" DOUBLE PRECISION,
    "leanBodyPercentage" DOUBLE PRECISION,
    "leanBodyMass" DOUBLE PRECISION,
    "hydrationPercentage" DOUBLE PRECISION,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Measurement_userId_date_idx" ON "Measurement"("userId", "date");

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
