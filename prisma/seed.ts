import { faker } from "@faker-js/faker";
import {
  PrismaClient,
  MembershipStatus,
  MembershipPlan,
  UserRole,
  YogaType,
  ExerciseType,
  ExerciseMode,
  SetType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.workoutActivityExercise.deleteMany();
  await prisma.workoutActivitySet.deleteMany();
  await prisma.workoutActivity.deleteMany();
  await prisma.yogaVideoActivity.deleteMany();
  await prisma.setExercise.deleteMany();
  await prisma.set.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.yogaVideo.deleteMany();
  await prisma.userExerciseWeight.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      name: "Adam Turner",
      email: "adamjamesturner93@gmail.com",
      role: UserRole.ADMIN,
      membershipStatus: MembershipStatus.ACTIVE,
      membershipPlan: MembershipPlan.GOLD,
    },
  });

  const regularUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Emily Johnson",
        email: "emily.johnson@example.com",
        role: UserRole.USER,
        membershipStatus: MembershipStatus.ACTIVE,
        membershipPlan: MembershipPlan.SILVER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Michael Chen",
        email: "michael.chen@example.com",
        role: UserRole.USER,
        membershipStatus: MembershipStatus.ACTIVE,
        membershipPlan: MembershipPlan.BRONZE,
      },
    }),
    prisma.user.create({
      data: {
        name: "Sophia Rodriguez",
        email: "sophia.rodriguez@example.com",
        role: UserRole.USER,
        membershipStatus: MembershipStatus.INACTIVE,
        membershipPlan: MembershipPlan.FREE,
      },
    }),
    prisma.user.create({
      data: {
        name: "Daniel Kim",
        email: "daniel.kim@example.com",
        role: UserRole.USER,
        membershipStatus: MembershipStatus.ACTIVE,
        membershipPlan: MembershipPlan.GOLD,
      },
    }),
  ]);

  const allUsers = [adminUser, ...regularUsers];

  // Create yoga videos
  const yogaVideos = await Promise.all([
    prisma.yogaVideo.create({
      data: {
        title: "Morning Sun Salutations",
        description: "Start your day with energizing sun salutations",
        type: YogaType.BUILD,
        props: ["mat"],
        url: "https://example.com/morning-sun-salutations",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        duration: 1200, // 20 minutes
      },
    }),
    prisma.yogaVideo.create({
      data: {
        title: "Gentle Bedtime Yoga",
        description: "Relax and unwind with this calming bedtime routine",
        type: YogaType.MINDFULNESS,
        props: ["mat", "bolster"],
        url: "https://example.com/gentle-bedtime-yoga",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        duration: 900, // 15 minutes
      },
    }),
    prisma.yogaVideo.create({
      data: {
        title: "Power Vinyasa Flow",
        description: "Challenge yourself with this dynamic vinyasa sequence",
        type: YogaType.BUILD,
        props: ["mat", "block"],
        url: "https://example.com/power-vinyasa-flow",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        duration: 3600, // 60 minutes
      },
    }),
    prisma.yogaVideo.create({
      data: {
        title: "Yin Yoga for Flexibility",
        description: "Improve flexibility with long-held, passive poses",
        type: YogaType.EXPLORE,
        props: ["mat", "strap", "bolster"],
        url: "https://example.com/yin-yoga-flexibility",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        duration: 2700, // 45 minutes
      },
    }),
    prisma.yogaVideo.create({
      data: {
        title: "Yoga for Back Pain Relief",
        description: "Gentle stretches and poses to alleviate back pain",
        type: YogaType.MINDFULNESS,
        props: ["mat", "block", "strap"],
        url: "https://example.com/yoga-back-pain-relief",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        duration: 1800, // 30 minutes
      },
    }),
    prisma.yogaVideo.create({
      data: {
        title: "Ashtanga Primary Series",
        description: "Traditional Ashtanga yoga primary series practice",
        type: YogaType.BUILD,
        props: ["mat"],
        url: "https://example.com/ashtanga-primary-series",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        duration: 5400, // 90 minutes
      },
    }),
    prisma.yogaVideo.create({
      data: {
        title: "Restorative Yoga for Stress Relief",
        description: "Deeply relaxing practice to reduce stress and anxiety",
        type: YogaType.MINDFULNESS,
        props: ["mat", "bolster", "blanket", "block"],
        url: "https://example.com/restorative-yoga-stress-relief",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        duration: 3600, // 60 minutes
      },
    }),
    prisma.yogaVideo.create({
      data: {
        title: "Yoga for Runners",
        description: "Stretch and strengthen key muscles for runners",
        type: YogaType.EXPLORE,
        props: ["mat", "strap"],
        url: "https://example.com/yoga-for-runners",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        duration: 2400, // 40 minutes
      },
    }),
    prisma.yogaVideo.create({
      data: {
        title: "Chair Yoga for Office Workers",
        description: "Simple yoga exercises you can do at your desk",
        type: YogaType.MINDFULNESS,
        props: ["chair"],
        url: "https://example.com/chair-yoga-office-workers",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        duration: 900, // 15 minutes
      },
    }),
    prisma.yogaVideo.create({
      data: {
        title: "Kundalini Yoga for Beginners",
        description: "Introduction to Kundalini yoga practice",
        type: YogaType.EXPLORE,
        props: ["mat", "blanket"],
        url: "https://example.com/kundalini-yoga-beginners",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        duration: 3600, // 60 minutes
      },
    }),
    prisma.yogaVideo.create({
      data: {
        title: "Prenatal Yoga: Second Trimester",
        description: "Safe and nurturing yoga practice for expecting mothers",
        type: YogaType.MINDFULNESS,
        props: ["mat", "bolster", "block"],
        url: "https://example.com/prenatal-yoga-second-trimester",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        duration: 2700, // 45 minutes
      },
    }),
    prisma.yogaVideo.create({
      data: {
        title: "Yoga for Better Sleep",
        description: "Calming sequences to prepare your body for rest",
        type: YogaType.MINDFULNESS,
        props: ["mat", "bolster"],
        url: "https://example.com/yoga-better-sleep",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        duration: 1800, // 30 minutes
      },
    }),
    prisma.yogaVideo.create({
      data: {
        title: "Core Strength Vinyasa",
        description: "Build core strength with this challenging vinyasa flow",
        type: YogaType.BUILD,
        props: ["mat"],
        url: "https://example.com/core-strength-vinyasa",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        duration: 3600, // 60 minutes
      },
    }),
    prisma.yogaVideo.create({
      data: {
        title: "Yoga for Hikers and Climbers",
        description: "Improve flexibility and balance for outdoor enthusiasts",
        type: YogaType.EXPLORE,
        props: ["mat", "block"],
        url: "https://example.com/yoga-hikers-climbers",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        duration: 2700, // 45 minutes
      },
    }),
    prisma.yogaVideo.create({
      data: {
        title: "Gentle Yoga for Seniors",
        description: "Safe, low-impact yoga practice for older adults",
        type: YogaType.MINDFULNESS,
        props: ["chair", "strap"],
        url: "https://example.com/gentle-yoga-seniors",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        duration: 1800, // 30 minutes
      },
    }),
  ]);

  // Create exercises
  const exercises = await Promise.all([
    prisma.exercise.create({
      data: {
        name: "Push-up",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        videoUrl: "https://example.com/push-up-video",
        muscleGroups: ["Chest", "Shoulders", "Triceps"],
        equipment: "None",
        type: ExerciseType.STRENGTH,
        mode: ExerciseMode.REPS,
        instructions:
          "Start in a plank position, lower your body until your chest nearly touches the floor, then push back up.",
      },
    }),
    prisma.exercise.create({
      data: {
        name: "Squat",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        videoUrl: "https://example.com/squat-video",
        muscleGroups: ["Quadriceps", "Hamstrings", "Glutes"],
        equipment: "None",
        type: ExerciseType.STRENGTH,
        mode: ExerciseMode.REPS,
        instructions:
          "Stand with feet shoulder-width apart, lower your body as if sitting back into a chair, then return to standing.",
      },
    }),
    prisma.exercise.create({
      data: {
        name: "Deadlift",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        videoUrl: "https://example.com/deadlift-video",
        muscleGroups: ["Back", "Glutes", "Hamstrings"],
        equipment: "Barbell",
        type: ExerciseType.STRENGTH,
        mode: ExerciseMode.REPS,
        instructions:
          "Stand with feet hip-width apart, bend at hips and knees to lower the bar to the ground, then stand up straight.",
      },
    }),
    prisma.exercise.create({
      data: {
        name: "Bench Press",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        videoUrl: "https://example.com/bench-press-video",
        muscleGroups: ["Chest", "Shoulders", "Triceps"],
        equipment: "Barbell, Bench",
        type: ExerciseType.STRENGTH,
        mode: ExerciseMode.REPS,
        instructions:
          "Lie on a bench, lower the barbell to your chest, then press it back up to the starting position.",
      },
    }),
    prisma.exercise.create({
      data: {
        name: "Pull-up",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        videoUrl: "https://example.com/pull-up-video",
        muscleGroups: ["Back", "Biceps"],
        equipment: "Pull-up Bar",
        type: ExerciseType.STRENGTH,
        mode: ExerciseMode.REPS,
        instructions:
          "Hang from a bar with palms facing away, pull your body up until your chin is over the bar, then lower back down.",
      },
    }),
    prisma.exercise.create({
      data: {
        name: "Plank",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        videoUrl: "https://example.com/plank-video",
        muscleGroups: ["Core", "Shoulders"],
        equipment: "None",
        type: ExerciseType.STRENGTH,
        mode: ExerciseMode.TIME,
        instructions:
          "Hold a push-up position with your forearms on the ground, keeping your body in a straight line.",
      },
    }),
    prisma.exercise.create({
      data: {
        name: "Lunges",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        videoUrl: "https://example.com/lunges-video",
        muscleGroups: ["Quadriceps", "Hamstrings", "Glutes"],
        equipment: "None",
        type: ExerciseType.STRENGTH,
        mode: ExerciseMode.REPS,
        instructions:
          "Step forward with one leg, lowering your hips until both knees are bent at about 90 degrees, then push back to the starting position.",
      },
    }),
    prisma.exercise.create({
      data: {
        name: "Dumbbell Shoulder Press",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        videoUrl: "https://example.com/shoulder-press-video",
        muscleGroups: ["Shoulders", "Triceps"],
        equipment: "Dumbbells",
        type: ExerciseType.STRENGTH,
        mode: ExerciseMode.REPS,
        instructions:
          "Stand with dumbbells at shoulder height, press them overhead until your arms are fully extended, then lower back down.",
      },
    }),
    prisma.exercise.create({
      data: {
        name: "Russian Twists",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        videoUrl: "https://example.com/russian-twists-video",
        muscleGroups: ["Core", "Obliques"],
        equipment: "None",
        type: ExerciseType.STRENGTH,
        mode: ExerciseMode.REPS,
        instructions:
          "Sit with knees bent and feet off the ground, lean back slightly, and  rotate your torso from side to side.",
      },
    }),
    prisma.exercise.create({
      data: {
        name: "Burpees",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        videoUrl: "https://example.com/burpees-video",
        muscleGroups: ["Full Body"],
        equipment: "None",
        type: ExerciseType.CARDIO,
        mode: ExerciseMode.REPS,
        instructions:
          "Start standing, drop into a squat, kick your legs back into a plank, do a push-up, jump your feet back to your hands, then jump up with hands overhead.",
      },
    }),
    prisma.exercise.create({
      data: {
        name: "Bicycle Crunches",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        videoUrl: "https://example.com/bicycle-crunches-video",
        muscleGroups: ["Core", "Obliques"],
        equipment: "None",
        type: ExerciseType.STRENGTH,
        mode: ExerciseMode.REPS,
        instructions:
          "Lie on your back, lift shoulders off the ground, and alternate bringing opposite elbow to opposite knee while extending the other leg.",
      },
    }),
    prisma.exercise.create({
      data: {
        name: "Dips",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        videoUrl: "https://example.com/dips-video",
        muscleGroups: ["Triceps", "Chest"],
        equipment: "Parallel Bars",
        type: ExerciseType.STRENGTH,
        mode: ExerciseMode.REPS,
        instructions:
          "Support yourself on parallel bars with straight arms, lower your body by bending your elbows, then push back up to the starting position.",
      },
    }),
    prisma.exercise.create({
      data: {
        name: "Mountain Climbers",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        videoUrl: "https://example.com/mountain-climbers-video",
        muscleGroups: ["Core", "Shoulders", "Legs"],
        equipment: "None",
        type: ExerciseType.CARDIO,
        mode: ExerciseMode.TIME,
        instructions:
          "Start in a plank position and alternate driving your knees towards your chest as if running in place.",
      },
    }),
    prisma.exercise.create({
      data: {
        name: "Kettlebell Swing",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        videoUrl: "https://example.com/kettlebell-swing-video",
        muscleGroups: ["Back", "Glutes", "Hamstrings"],
        equipment: "Kettlebell",
        type: ExerciseType.STRENGTH,
        mode: ExerciseMode.REPS,
        instructions:
          "With feet shoulder-width apart, hinge at the hips and swing the kettlebell between your legs, then drive your hips forward to swing the kettlebell up to chest height.",
      },
    }),
    prisma.exercise.create({
      data: {
        name: "Jump Rope",
        thumbnailUrl: "/placeholder.svg?height=240&width=320",
        videoUrl: "https://example.com/jump-rope-video",
        muscleGroups: ["Calves", "Shoulders"],
        equipment: "Jump Rope",
        type: ExerciseType.CARDIO,
        mode: ExerciseMode.TIME,
        instructions:
          "Hold the handles of the jump rope and swing it over your head and under your feet, jumping to let it pass under you.",
      },
    }),
  ]);

  // Create workouts
  const workouts = await Promise.all([
    prisma.workout.create({
      data: {
        name: "Full Body Strength",
        description:
          "A comprehensive full-body workout to build overall strength",
        totalLength: 3600, // 60 minutes
        equipment: ["Barbell", "Dumbbells", "Bench"],
        muscleGroups: ["Chest", "Back", "Legs", "Shoulders", "Arms"],
        sets: {
          create: [
            {
              type: SetType.SUPERSET,
              rounds: 3,
              rest: 60,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[0].id } },
                    targetReps: 12,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[1].id } },
                    targetReps: 15,
                    order: 2,
                  },
                ],
              },
            },
            {
              type: SetType.MULTISET,
              rounds: 4,
              rest: 90,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[2].id } },
                    targetReps: 8,
                    order: 1,
                  },
                ],
              },
            },
            {
              type: SetType.TRISET,
              rounds: 3,
              rest: 45,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[3].id } },
                    targetReps: 10,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[4].id } },
                    targetReps: 8,
                    order: 2,
                  },
                  {
                    exercise: { connect: { id: exercises[5].id } },
                    targetReps: 12,
                    order: 3,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sets: {
          include: {
            exercises: true,
          },
        },
      },
    }),
    prisma.workout.create({
      data: {
        name: "HIIT Cardio Blast",
        description:
          "High-intensity interval training to boost cardiovascular fitness",
        totalLength: 1800, // 30 minutes
        equipment: ["None"],
        muscleGroups: ["Full Body"],
        sets: {
          create: [
            {
              type: SetType.CIRCUIT,
              rounds: 4,
              rest: 30,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[9].id } },
                    targetReps: 15,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[6].id } },
                    targetReps: 30,
                    order: 2,
                  },
                  {
                    exercise: { connect: { id: exercises[13].id } },
                    targetReps: 30,
                    order: 3,
                  },
                  {
                    exercise: { connect: { id: exercises[14].id } },
                    targetReps: 50,
                    order: 4,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sets: {
          include: {
            exercises: true,
          },
        },
      },
    }),
    prisma.workout.create({
      data: {
        name: "Upper Body Power",
        description: "Focus on building upper body strength and muscle",
        totalLength: 2700, // 45 minutes
        equipment: ["Dumbbells", "Barbell", "Pull-up Bar"],
        muscleGroups: ["Chest", "Back", "Shoulders", "Arms"],
        sets: {
          create: [
            {
              type: SetType.SUPERSET,
              rounds: 4,
              rest: 60,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[3].id } },
                    targetReps: 8,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[4].id } },
                    targetReps: 10,
                    order: 2,
                  },
                ],
              },
            },
            {
              type: SetType.TRISET,
              rounds: 3,
              rest: 45,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[7].id } },
                    targetReps: 12,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[11].id } },
                    targetReps: 15,
                    order: 2,
                  },
                  {
                    exercise: { connect: { id: exercises[0].id } },
                    targetReps: 20,
                    order: 3,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sets: {
          include: {
            exercises: true,
          },
        },
      },
    }),
    prisma.workout.create({
      data: {
        name: "Core Crusher",
        description: "Intense abdominal and core strengthening workout",
        totalLength: 1800, // 30 minutes
        equipment: ["None"],
        muscleGroups: ["Core", "Abs", "Obliques"],
        sets: {
          create: [
            {
              type: SetType.CIRCUIT,
              rounds: 3,
              rest: 30,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[5].id } },
                    targetReps: 60,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[8].id } },
                    targetReps: 30,
                    order: 2,
                  },
                  {
                    exercise: { connect: { id: exercises[10].id } },
                    targetReps: 40,
                    order: 3,
                  },
                  {
                    exercise: { connect: { id: exercises[13].id } },
                    targetReps: 30,
                    order: 4,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sets: {
          include: {
            exercises: true,
          },
        },
      },
    }),
    prisma.workout.create({
      data: {
        name: "Leg Day Challenge",
        description: "Intense lower body workout to build strength and muscle",
        totalLength: 3600, // 60 minutes
        equipment: ["Barbell", "Dumbbells"],
        muscleGroups: ["Quadriceps", "Hamstrings", "Glutes", "Calves"],
        sets: {
          create: [
            {
              type: SetType.MULTISET,
              rounds: 5,
              rest: 120,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[1].id } },
                    targetReps: 10,
                    order: 1,
                  },
                ],
              },
            },
            {
              type: SetType.SUPERSET,
              rounds: 4,
              rest: 60,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[2].id } },
                    targetReps: 12,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[6].id } },
                    targetReps: 15,
                    order: 2,
                  },
                ],
              },
            },
            {
              type: SetType.TRISET,
              rounds: 3,
              rest: 45,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[14].id } },
                    targetReps: 20,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[9].id } },
                    targetReps: 15,
                    order: 2,
                  },
                  {
                    exercise: { connect: { id: exercises[13].id } },
                    targetReps: 30,
                    order: 3,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sets: {
          include: {
            exercises: true,
          },
        },
      },
    }),
    prisma.workout.create({
      data: {
        name: "Bodyweight Basics",
        description: "Full-body workout using only your body weight",
        totalLength: 2400, // 40 minutes
        equipment: ["None"],
        muscleGroups: ["Full Body"],
        sets: {
          create: [
            {
              type: SetType.CIRCUIT,
              rounds: 4,
              rest: 30,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[0].id } },
                    targetReps: 15,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[1].id } },
                    targetReps: 20,
                    order: 2,
                  },
                  {
                    exercise: { connect: { id: exercises[4].id } },
                    targetReps: 8,
                    order: 3,
                  },
                  {
                    exercise: { connect: { id: exercises[6].id } },
                    targetReps: 20,
                    order: 4,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sets: {
          include: {
            exercises: true,
          },
        },
      },
    }),
    prisma.workout.create({
      data: {
        name: "Kettlebell Conditioning",
        description: "Full-body workout focusing on kettlebell exercises",
        totalLength: 2700, // 45 minutes
        equipment: ["Kettlebell"],
        muscleGroups: ["Full Body"],
        sets: {
          create: [
            {
              type: SetType.SUPERSET,
              rounds: 4,
              rest: 60,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[14].id } },
                    targetReps: 15,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[1].id } },
                    targetReps: 12,
                    order: 2,
                  },
                ],
              },
            },
            {
              type: SetType.TRISET,
              rounds: 3,
              rest: 45,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[7].id } },
                    targetReps: 10,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[8].id } },
                    targetReps: 20,
                    order: 2,
                  },
                  {
                    exercise: { connect: { id: exercises[13].id } },
                    targetReps: 30,
                    order: 3,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sets: {
          include: {
            exercises: true,
          },
        },
      },
    }),
    prisma.workout.create({
      data: {
        name: "Endurance Builder",
        description:
          "High-rep, low-weight workout to improve muscular endurance",
        totalLength: 3600, // 60 minutes
        equipment: ["Dumbbells", "Resistance Bands"],
        muscleGroups: ["Full Body"],
        sets: {
          create: [
            {
              type: SetType.CIRCUIT,
              rounds: 3,
              rest: 30,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[0].id } },
                    targetReps: 25,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[1].id } },
                    targetReps: 30,
                    order: 2,
                  },
                  {
                    exercise: { connect: { id: exercises[7].id } },
                    targetReps: 20,
                    order: 3,
                  },
                  {
                    exercise: { connect: { id: exercises[10].id } },
                    targetReps: 50,
                    order: 4,
                  },
                ],
              },
            },
            {
              type: SetType.CIRCUIT,
              rounds: 3,
              rest: 30,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[6].id } },
                    targetReps: 30,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[8].id } },
                    targetReps: 40,
                    order: 2,
                  },
                  {
                    exercise: { connect: { id: exercises[13].id } },
                    targetReps: 45,
                    order: 3,
                  },
                  {
                    exercise: { connect: { id: exercises[14].id } },
                    targetReps: 100,
                    order: 4,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sets: {
          include: {
            exercises: true,
          },
        },
      },
    }),
    prisma.workout.create({
      data: {
        name: "Functional Fitness",
        description:
          "Workout focusing on movements that mimic everyday activities",
        totalLength: 2700, // 45 minutes
        equipment: ["Kettlebell", "Medicine Ball"],
        muscleGroups: ["Full Body"],
        sets: {
          create: [
            {
              type: SetType.CIRCUIT,
              rounds: 4,
              rest: 30,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[14].id } },
                    targetReps: 15,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[2].id } },
                    targetReps: 12,
                    order: 2,
                  },
                  {
                    exercise: { connect: { id: exercises[6].id } },
                    targetReps: 20,
                    order: 3,
                  },
                  {
                    exercise: { connect: { id: exercises[9].id } },
                    targetReps: 15,
                    order: 4,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sets: {
          include: {
            exercises: true,
          },
        },
      },
    }),
    prisma.workout.create({
      data: {
        name: "Power and Explosiveness",
        description:
          "Workout designed to improve power output and explosive movements",
        totalLength: 2400, // 40 minutes
        equipment: ["Barbell", "Plyo Box"],
        muscleGroups: ["Full Body"],
        sets: {
          create: [
            {
              type: SetType.SUPERSET,
              rounds: 5,
              rest: 90,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[2].id } },
                    targetReps: 5,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[9].id } },
                    targetReps: 10,
                    order: 2,
                  },
                ],
              },
            },
            {
              type: SetType.TRISET,
              rounds: 4,
              rest: 60,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[7].id } },
                    targetReps: 8,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[14].id } },
                    targetReps: 15,
                    order: 2,
                  },
                  {
                    exercise: { connect: { id: exercises[13].id } },
                    targetReps: 20,
                    order: 3,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sets: {
          include: {
            exercises: true,
          },
        },
      },
    }),
    prisma.workout.create({
      data: {
        name: "Active Recovery",
        description:
          "Low-intensity workout to promote recovery and maintain activity",
        totalLength: 1800, // 30 minutes
        equipment: ["Resistance Bands"],
        muscleGroups: ["Full Body"],
        sets: {
          create: [
            {
              type: SetType.CIRCUIT,
              rounds: 2,
              rest: 30,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[5].id } },
                    targetReps: 30,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[6].id } },
                    targetReps: 15,
                    order: 2,
                  },
                  {
                    exercise: { connect: { id: exercises[8].id } },
                    targetReps: 20,
                    order: 3,
                  },
                  {
                    exercise: { connect: { id: exercises[14].id } },
                    targetReps: 50,
                    order: 4,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sets: {
          include: {
            exercises: true,
          },
        },
      },
    }),
    prisma.workout.create({
      data: {
        name: "Strength and Stability",
        description:
          "Workout focusing on building strength while improving balance and stability",
        totalLength: 3000, // 50 minutes
        equipment: ["Dumbbells", "Stability Ball"],
        muscleGroups: ["Full Body"],
        sets: {
          create: [
            {
              type: SetType.SUPERSET,
              rounds: 4,
              rest: 60,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[1].id } },
                    targetReps: 12,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[5].id } },
                    targetReps: 45,
                    order: 2,
                  },
                ],
              },
            },
            {
              type: SetType.TRISET,
              rounds: 3,
              rest: 45,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[7].id } },
                    targetReps: 10,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[6].id } },
                    targetReps: 15,
                    order: 2,
                  },
                  {
                    exercise: { connect: { id: exercises[8].id } },
                    targetReps: 20,
                    order: 3,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sets: {
          include: {
            exercises: true,
          },
        },
      },
    }),
    prisma.workout.create({
      data: {
        name: "Metabolic Conditioning",
        description:
          "High-intensity workout to boost metabolism and burn calories",
        totalLength: 2400, // 40 minutes
        equipment: ["Jump Rope", "Kettlebell"],
        muscleGroups: ["Full Body"],
        sets: {
          create: [
            {
              type: SetType.CIRCUIT,
              rounds: 5,
              rest: 30,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[14].id } },
                    targetReps: 100,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[9].id } },
                    targetReps: 15,
                    order: 2,
                  },
                  {
                    exercise: { connect: { id: exercises[13].id } },
                    targetReps: 30,
                    order: 3,
                  },
                  {
                    exercise: { connect: { id: exercises[14].id } },
                    targetReps: 20,
                    order: 4,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sets: {
          include: {
            exercises: true,
          },
        },
      },
    }),
    prisma.workout.create({
      data: {
        name: "Mobility and Flexibility",
        description:
          "Workout designed to improve range of motion and flexibility",
        totalLength: 2700, // 45 minutes
        equipment: ["Yoga Mat", "Foam Roller"],
        muscleGroups: ["Full Body"],
        sets: {
          create: [
            {
              type: SetType.CIRCUIT,
              rounds: 3,
              rest: 30,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[6].id } },
                    targetReps: 15,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[5].id } },
                    targetReps: 60,
                    order: 2,
                  },
                  {
                    exercise: { connect: { id: exercises[8].id } },
                    targetReps: 20,
                    order: 3,
                  },
                  {
                    exercise: { connect: { id: exercises[10].id } },
                    targetReps: 30,
                    order: 4,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sets: {
          include: {
            exercises: true,
          },
        },
      },
    }),
    prisma.workout.create({
      data: {
        name: "Sports Performance",
        description:
          "Workout targeting key areas for overall athletic performance",
        totalLength: 3300, // 55 minutes
        equipment: ["Agility Ladder", "Medicine Ball", "Resistance Bands"],
        muscleGroups: ["Full Body"],
        sets: {
          create: [
            {
              type: SetType.CIRCUIT,
              rounds: 4,
              rest: 45,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[9].id } },
                    targetReps: 15,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[13].id } },
                    targetReps: 30,
                    order: 2,
                  },
                  {
                    exercise: { connect: { id: exercises[4].id } },
                    targetReps: 8,
                    order: 3,
                  },
                  {
                    exercise: { connect: { id: exercises[14].id } },
                    targetReps: 20,
                    order: 4,
                  },
                ],
              },
            },
            {
              type: SetType.SUPERSET,
              rounds: 3,
              rest: 60,
              exercises: {
                create: [
                  {
                    exercise: { connect: { id: exercises[2].id } },
                    targetReps: 10,
                    order: 1,
                  },
                  {
                    exercise: { connect: { id: exercises[7].id } },
                    targetReps: 12,
                    order: 2,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sets: {
          include: {
            exercises: true,
          },
        },
      },
    }),
  ]);

  // Create workout histories
  const workoutHistories = await Promise.all(
    Array.from({ length: 10 }).map(async (_, index) => {
      const user = allUsers[index % allUsers.length];
      const workout = workouts[index % workouts.length];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - index * 2); // Each history entry is two days apart
      const endDate = new Date(
        startDate.getTime() + workout.totalLength * 1000
      );
      const id = faker.string.uuid();

      return prisma.workoutActivity.create({
        data: {
          userId: user.id,
          workoutId: workout.id,
          startedAt: startDate,
          endedAt: endDate,
          id,
          sets: {
            create: workout.sets.map((set, setIndex) => ({
              setNumber: setIndex + 1,
              roundNumber: 1,
              exercises: {
                create: set.exercises.map((setExercise) => {
                  const exercise = exercises.find(
                    (e) => e.id === setExercise.exerciseId
                  );
                  if (!exercise)
                    throw new Error(
                      `Exercise not found: ${setExercise.exerciseId}`
                    );

                  return {
                    exerciseId: setExercise.exerciseId,
                    workoutActivityId: id,
                    weight: Math.floor(Math.random() * 20) + 10, // Random weight between 10 and 30
                    reps:
                      Math.floor(Math.random() * 5) +
                      setExercise.targetReps -
                      2, // Random reps around target
                    time:
                      exercise.mode === ExerciseMode.TIME
                        ? Math.floor(Math.random() * 30) + 30
                        : null,
                    distance:
                      exercise.mode === ExerciseMode.DISTANCE
                        ? Math.floor(Math.random() * 1000) + 500
                        : null,
                  };
                }),
              },
            })),
          },
        },
      });
    })
  );

  // Create yoga histories
  const yogaHistories = await Promise.all(
    Array.from({ length: 10 }).map((_, index) => {
      const user = allUsers[index % allUsers.length];
      const video = yogaVideos[index % yogaVideos.length];
      const watchedAt = new Date();
      watchedAt.setDate(watchedAt.getDate() - index);

      return prisma.yogaVideoActivity.create({
        data: {
          userId: user.id,
          videoId: video.id,
          watchedAt: watchedAt,
        },
      });
    })
  );

  // Create user exercise weights
  const userExerciseWeights = await Promise.all(
    allUsers.flatMap((user) =>
      workouts.flatMap((workout) =>
        exercises.map((exercise) =>
          prisma.userExerciseWeight.create({
            data: {
              userId: user.id,
              workoutId: workout.id,
              exerciseId: exercise.id,
              weight: Math.floor(Math.random() * 20) + 10, // Random weight between 10 and 30
            },
          })
        )
      )
    )
  );

  console.log(`Seeding completed:
    - ${allUsers.length} users created (1 admin, ${regularUsers.length} regular)
    - ${yogaVideos.length} yoga videos created
    - ${exercises.length} exercises created
    - ${workouts.length} workouts created
    - ${yogaHistories.length} yoga histories created
    - ${workoutHistories.length} workout histories created
    - ${userExerciseWeights.length} user exercise weights created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
