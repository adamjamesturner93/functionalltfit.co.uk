-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('IMPERIAL', 'METRIC');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MembershipPlan" AS ENUM ('FREE', 'BRONZE', 'SILVER', 'GOLD');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "YogaType" AS ENUM ('MINDFULNESS', 'BUILD', 'EXPLORE');

-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('STRENGTH', 'CARDIO', 'FLEXIBILITY', 'BALANCE');

-- CreateEnum
CREATE TYPE "ExerciseMode" AS ENUM ('REPS', 'TIME', 'DISTANCE');

-- CreateEnum
CREATE TYPE "SetType" AS ENUM ('MULTISET', 'SUPERSET', 'TRISET', 'CIRCUIT');

-- CreateEnum
CREATE TYPE "GoalPeriod" AS ENUM ('WEEK', 'MONTH');

-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('WEIGHT', 'YOGA_SESSIONS', 'WORKOUT_SESSIONS', 'TOTAL_SESSIONS', 'CUSTOM', 'EXERCISE_WEIGHT', 'EXERCISE_REPS', 'EXERCISE_DISTANCE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "email" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "membershipStatus" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "membershipPlan" "MembershipPlan" NOT NULL DEFAULT 'FREE',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "authCode" TEXT,
    "authCodeExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lengthUnit" "Unit" NOT NULL DEFAULT 'METRIC',
    "weightUnit" "Unit" NOT NULL DEFAULT 'METRIC',

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "bloodPressureSystolic" INTEGER,
    "bloodPressureDiastolic" INTEGER,
    "restingHeartRate" INTEGER,
    "sleepHours" DOUBLE PRECISION,
    "stressLevel" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyMeasurement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "calve" DOUBLE PRECISION,
    "thigh" DOUBLE PRECISION,
    "waist" DOUBLE PRECISION,
    "hips" DOUBLE PRECISION,
    "butt" DOUBLE PRECISION,
    "chest" DOUBLE PRECISION,
    "arm" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BodyMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "YogaVideo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "YogaType" NOT NULL,
    "props" TEXT[],
    "muxPlaybackId" TEXT NOT NULL,
    "muxAssetId" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YogaVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YogaVideoActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "watchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "YogaVideoActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "muscleGroups" TEXT[],
    "equipment" TEXT NOT NULL DEFAULT 'None',
    "type" "ExerciseType" NOT NULL,
    "mode" "ExerciseMode" NOT NULL,
    "instructions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT NOT NULL DEFAULT '/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png',
    "totalLength" INTEGER NOT NULL,
    "equipment" TEXT[],
    "muscleGroups" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Set" (
    "id" TEXT NOT NULL,
    "type" "SetType" NOT NULL,
    "rounds" INTEGER NOT NULL,
    "rest" INTEGER NOT NULL,
    "gap" INTEGER,
    "workoutId" TEXT NOT NULL,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetExercise" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "setId" TEXT NOT NULL,
    "targetReps" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "SetExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "WorkoutActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutActivitySet" (
    "id" TEXT NOT NULL,
    "workoutActivityId" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "roundNumber" INTEGER NOT NULL,

    CONSTRAINT "WorkoutActivitySet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutActivityExercise" (
    "id" TEXT NOT NULL,
    "workoutActivityId" TEXT NOT NULL,
    "workoutActivitySetId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "reps" INTEGER,
    "time" INTEGER,
    "distance" DOUBLE PRECISION,
    "roundNumber" INTEGER NOT NULL,

    CONSTRAINT "WorkoutActivityExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserExerciseWeight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UserExerciseWeight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programme" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "sessionsPerWeek" INTEGER NOT NULL,
    "intention" TEXT NOT NULL,
    "weeks" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgrammeActivity" (
    "id" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "activityType" TEXT NOT NULL,
    "workoutId" TEXT,
    "yogaVideoId" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgrammeActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgramme" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "progress" JSONB NOT NULL,

    CONSTRAINT "UserProgramme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "GoalType" NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "current" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "period" "GoalPeriod",
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "exerciseId" TEXT,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWorkoutSave" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserWorkoutSave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserYogaVideoSave" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "yogaVideoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserYogaVideoSave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgrammeSave" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProgrammeSave_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Preferences_userId_key" ON "Preferences"("userId");

-- CreateIndex
CREATE INDEX "HealthData_userId_date_idx" ON "HealthData"("userId", "date");

-- CreateIndex
CREATE INDEX "BodyMeasurement_userId_date_idx" ON "BodyMeasurement"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "YogaVideoActivity_userId_videoId_watchedAt_key" ON "YogaVideoActivity"("userId", "videoId", "watchedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutActivitySet_workoutActivityId_setNumber_roundNumber_key" ON "WorkoutActivitySet"("workoutActivityId", "setNumber", "roundNumber");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutActivityExercise_workoutActivitySetId_exerciseId_rou_key" ON "WorkoutActivityExercise"("workoutActivitySetId", "exerciseId", "roundNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UserExerciseWeight_userId_workoutId_exerciseId_key" ON "UserExerciseWeight"("userId", "workoutId", "exerciseId");

-- CreateIndex
CREATE INDEX "Goal_userId_idx" ON "Goal"("userId");

-- CreateIndex
CREATE INDEX "UserWorkoutSave_userId_idx" ON "UserWorkoutSave"("userId");

-- CreateIndex
CREATE INDEX "UserWorkoutSave_workoutId_idx" ON "UserWorkoutSave"("workoutId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorkoutSave_userId_workoutId_key" ON "UserWorkoutSave"("userId", "workoutId");

-- CreateIndex
CREATE INDEX "UserYogaVideoSave_userId_idx" ON "UserYogaVideoSave"("userId");

-- CreateIndex
CREATE INDEX "UserYogaVideoSave_yogaVideoId_idx" ON "UserYogaVideoSave"("yogaVideoId");

-- CreateIndex
CREATE UNIQUE INDEX "UserYogaVideoSave_userId_yogaVideoId_key" ON "UserYogaVideoSave"("userId", "yogaVideoId");

-- CreateIndex
CREATE INDEX "UserProgrammeSave_userId_idx" ON "UserProgrammeSave"("userId");

-- CreateIndex
CREATE INDEX "UserProgrammeSave_programmeId_idx" ON "UserProgrammeSave"("programmeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgrammeSave_userId_programmeId_key" ON "UserProgrammeSave"("userId", "programmeId");

-- AddForeignKey
ALTER TABLE "Preferences" ADD CONSTRAINT "Preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthData" ADD CONSTRAINT "HealthData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BodyMeasurement" ADD CONSTRAINT "BodyMeasurement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YogaVideoActivity" ADD CONSTRAINT "YogaVideoActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YogaVideoActivity" ADD CONSTRAINT "YogaVideoActivity_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "YogaVideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetExercise" ADD CONSTRAINT "SetExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetExercise" ADD CONSTRAINT "SetExercise_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutActivity" ADD CONSTRAINT "WorkoutActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutActivity" ADD CONSTRAINT "WorkoutActivity_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutActivitySet" ADD CONSTRAINT "WorkoutActivitySet_workoutActivityId_fkey" FOREIGN KEY ("workoutActivityId") REFERENCES "WorkoutActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutActivityExercise" ADD CONSTRAINT "WorkoutActivityExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutActivityExercise" ADD CONSTRAINT "WorkoutActivityExercise_workoutActivityId_fkey" FOREIGN KEY ("workoutActivityId") REFERENCES "WorkoutActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutActivityExercise" ADD CONSTRAINT "WorkoutActivityExercise_workoutActivitySetId_fkey" FOREIGN KEY ("workoutActivitySetId") REFERENCES "WorkoutActivitySet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExerciseWeight" ADD CONSTRAINT "UserExerciseWeight_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExerciseWeight" ADD CONSTRAINT "UserExerciseWeight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExerciseWeight" ADD CONSTRAINT "UserExerciseWeight_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeActivity" ADD CONSTRAINT "ProgrammeActivity_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeActivity" ADD CONSTRAINT "ProgrammeActivity_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeActivity" ADD CONSTRAINT "ProgrammeActivity_yogaVideoId_fkey" FOREIGN KEY ("yogaVideoId") REFERENCES "YogaVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgramme" ADD CONSTRAINT "UserProgramme_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgramme" ADD CONSTRAINT "UserProgramme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkoutSave" ADD CONSTRAINT "UserWorkoutSave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkoutSave" ADD CONSTRAINT "UserWorkoutSave_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserYogaVideoSave" ADD CONSTRAINT "UserYogaVideoSave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserYogaVideoSave" ADD CONSTRAINT "UserYogaVideoSave_yogaVideoId_fkey" FOREIGN KEY ("yogaVideoId") REFERENCES "YogaVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgrammeSave" ADD CONSTRAINT "UserProgrammeSave_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgrammeSave" ADD CONSTRAINT "UserProgrammeSave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

