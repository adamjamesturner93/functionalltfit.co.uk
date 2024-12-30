-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_userId_fkey";

-- DropForeignKey
ALTER TABLE "HealthData" DROP CONSTRAINT "HealthData_userId_fkey";

-- DropForeignKey
ALTER TABLE "Measurement" DROP CONSTRAINT "Measurement_userId_fkey";

-- DropForeignKey
ALTER TABLE "Preferences" DROP CONSTRAINT "Preferences_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProgrammeActivity" DROP CONSTRAINT "ProgrammeActivity_programmeId_fkey";

-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "SetExercise" DROP CONSTRAINT "SetExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "SetExercise" DROP CONSTRAINT "SetExercise_setId_fkey";

-- DropForeignKey
ALTER TABLE "UserExerciseWeight" DROP CONSTRAINT "UserExerciseWeight_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "UserExerciseWeight" DROP CONSTRAINT "UserExerciseWeight_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserExerciseWeight" DROP CONSTRAINT "UserExerciseWeight_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "UserProgramme" DROP CONSTRAINT "UserProgramme_programmeId_fkey";

-- DropForeignKey
ALTER TABLE "UserProgramme" DROP CONSTRAINT "UserProgramme_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutActivity" DROP CONSTRAINT "WorkoutActivity_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutActivity" DROP CONSTRAINT "WorkoutActivity_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutActivityExercise" DROP CONSTRAINT "WorkoutActivityExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutActivityExercise" DROP CONSTRAINT "WorkoutActivityExercise_workoutActivityId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutActivityExercise" DROP CONSTRAINT "WorkoutActivityExercise_workoutActivitySetId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutActivitySet" DROP CONSTRAINT "WorkoutActivitySet_workoutActivityId_fkey";

-- DropForeignKey
ALTER TABLE "YogaVideoActivity" DROP CONSTRAINT "YogaVideoActivity_userId_fkey";

-- DropForeignKey
ALTER TABLE "YogaVideoActivity" DROP CONSTRAINT "YogaVideoActivity_videoId_fkey";

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Exercise_type_mode_idx" ON "Exercise"("type", "mode");

-- CreateIndex
CREATE INDEX "Exercise_muscleGroups_idx" ON "Exercise"("muscleGroups");

-- CreateIndex
CREATE INDEX "Goal_type_idx" ON "Goal"("type");

-- CreateIndex
CREATE INDEX "Programme_title_idx" ON "Programme"("title");

-- CreateIndex
CREATE INDEX "Programme_intention_idx" ON "Programme"("intention");

-- CreateIndex
CREATE INDEX "ProgrammeActivity_programmeId_idx" ON "ProgrammeActivity"("programmeId");

-- CreateIndex
CREATE INDEX "ProgrammeActivity_workoutId_idx" ON "ProgrammeActivity"("workoutId");

-- CreateIndex
CREATE INDEX "ProgrammeActivity_yogaVideoId_idx" ON "ProgrammeActivity"("yogaVideoId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Set_workoutId_idx" ON "Set"("workoutId");

-- CreateIndex
CREATE INDEX "SetExercise_exerciseId_idx" ON "SetExercise"("exerciseId");

-- CreateIndex
CREATE INDEX "SetExercise_setId_idx" ON "SetExercise"("setId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_membershipStatus_membershipPlan_idx" ON "User"("membershipStatus", "membershipPlan");

-- CreateIndex
CREATE INDEX "UserExerciseWeight_userId_idx" ON "UserExerciseWeight"("userId");

-- CreateIndex
CREATE INDEX "UserExerciseWeight_workoutId_idx" ON "UserExerciseWeight"("workoutId");

-- CreateIndex
CREATE INDEX "UserExerciseWeight_exerciseId_idx" ON "UserExerciseWeight"("exerciseId");

-- CreateIndex
CREATE INDEX "UserProgramme_userId_idx" ON "UserProgramme"("userId");

-- CreateIndex
CREATE INDEX "UserProgramme_programmeId_idx" ON "UserProgramme"("programmeId");

-- CreateIndex
CREATE INDEX "Workout_name_idx" ON "Workout"("name");

-- CreateIndex
CREATE INDEX "Workout_equipment_idx" ON "Workout"("equipment");

-- CreateIndex
CREATE INDEX "Workout_muscleGroups_idx" ON "Workout"("muscleGroups");

-- CreateIndex
CREATE INDEX "WorkoutActivity_userId_startedAt_idx" ON "WorkoutActivity"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "WorkoutActivity_workoutId_idx" ON "WorkoutActivity"("workoutId");

-- CreateIndex
CREATE INDEX "WorkoutActivityExercise_exerciseId_idx" ON "WorkoutActivityExercise"("exerciseId");

-- CreateIndex
CREATE INDEX "WorkoutActivityExercise_workoutActivityId_idx" ON "WorkoutActivityExercise"("workoutActivityId");

-- CreateIndex
CREATE INDEX "YogaVideo_type_idx" ON "YogaVideo"("type");

-- CreateIndex
CREATE INDEX "YogaVideoActivity_userId_idx" ON "YogaVideoActivity"("userId");

-- CreateIndex
CREATE INDEX "YogaVideoActivity_videoId_idx" ON "YogaVideoActivity"("videoId");

-- AddForeignKey
ALTER TABLE "Preferences" ADD CONSTRAINT "Preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthData" ADD CONSTRAINT "HealthData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YogaVideoActivity" ADD CONSTRAINT "YogaVideoActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YogaVideoActivity" ADD CONSTRAINT "YogaVideoActivity_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "YogaVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetExercise" ADD CONSTRAINT "SetExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetExercise" ADD CONSTRAINT "SetExercise_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutActivity" ADD CONSTRAINT "WorkoutActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutActivity" ADD CONSTRAINT "WorkoutActivity_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutActivitySet" ADD CONSTRAINT "WorkoutActivitySet_workoutActivityId_fkey" FOREIGN KEY ("workoutActivityId") REFERENCES "WorkoutActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutActivityExercise" ADD CONSTRAINT "WorkoutActivityExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutActivityExercise" ADD CONSTRAINT "WorkoutActivityExercise_workoutActivityId_fkey" FOREIGN KEY ("workoutActivityId") REFERENCES "WorkoutActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutActivityExercise" ADD CONSTRAINT "WorkoutActivityExercise_workoutActivitySetId_fkey" FOREIGN KEY ("workoutActivitySetId") REFERENCES "WorkoutActivitySet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExerciseWeight" ADD CONSTRAINT "UserExerciseWeight_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExerciseWeight" ADD CONSTRAINT "UserExerciseWeight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExerciseWeight" ADD CONSTRAINT "UserExerciseWeight_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeActivity" ADD CONSTRAINT "ProgrammeActivity_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgramme" ADD CONSTRAINT "UserProgramme_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgramme" ADD CONSTRAINT "UserProgramme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
