import { faker } from '@faker-js/faker';
import {
  ExerciseMode,
  ExerciseType,
  MembershipPlan,
  MembershipStatus,
  PrismaClient,
  SetType,
  UserRole,
  YogaType,
} from '@prisma/client';

const prisma = new PrismaClient();

const EXERCISES = [
  {
    name: 'Push-up',
    thumbnailUrl: '/exercises/push-up.jpg',
    videoUrl: 'https://example.com/videos/push-up.mp4',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    equipment: 'None',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Start in a plank position. Lower your body until your chest nearly touches the floor. Push your body up to the starting position. Repeat.',
  },
  {
    name: 'Squat',
    thumbnailUrl: '/exercises/squat.jpg',
    videoUrl: 'https://example.com/videos/squat.mp4',
    muscleGroups: ['Quadriceps', 'Hamstrings', 'Glutes'],
    equipment: 'None',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with feet shoulder-width apart. Lower your body as if sitting back into a chair. Keep your chest up and weight in your heels. Push back up to the starting position. Repeat.',
  },
  {
    name: 'Plank',
    thumbnailUrl: '/exercises/plank.jpg',
    videoUrl: 'https://example.com/videos/plank.mp4',
    muscleGroups: ['Core', 'Shoulders'],
    equipment: 'None',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.TIME,
    instructions:
      'Start in a push-up position with your forearms on the ground. Keep your body in a straight line from head to heels. Hold this position.',
  },
  {
    name: 'Burpee',
    thumbnailUrl: '/exercises/burpee.jpg',
    videoUrl: 'https://example.com/videos/burpee.mp4',
    muscleGroups: ['Full Body'],
    equipment: 'None',
    type: ExerciseType.CARDIO,
    mode: ExerciseMode.REPS,
    instructions:
      'Start standing. Drop into a squat position and place your hands on the floor. Kick your feet back into a plank position. Do a push-up. Jump your feet back to your hands. Stand and jump with your hands above your head. Repeat.',
  },
  {
    name: 'Lunges',
    thumbnailUrl: '/exercises/lunges.jpg',
    videoUrl: 'https://example.com/videos/lunges.mp4',
    muscleGroups: ['Quadriceps', 'Hamstrings', 'Glutes'],
    equipment: 'None',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with feet hip-width apart. Step forward with one leg and lower your hips until both knees are bent at 90-degree angles. Push back to the starting position. Repeat, alternating legs.',
  },
  {
    name: 'Mountain Climbers',
    thumbnailUrl: '/exercises/mountain-climbers.jpg',
    videoUrl: 'https://example.com/videos/mountain-climbers.mp4',
    muscleGroups: ['Core', 'Shoulders', 'Legs'],
    equipment: 'None',
    type: ExerciseType.CARDIO,
    mode: ExerciseMode.TIME,
    instructions:
      'Start in a plank position. Bring one knee towards your chest. Quickly switch and bring the other knee in. Continue alternating legs as if running in place.',
  },
  {
    name: 'Dumbbell Bench Press',
    thumbnailUrl: '/exercises/dumbbell-bench-press.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-bench-press.mp4',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on a bench with a dumbbell in each hand at chest level. Push the dumbbells up until your arms are fully extended. Lower the weights back to the starting position. Repeat.',
  },
  {
    name: 'Barbell Bench Press',
    thumbnailUrl: '/exercises/barbell-bench-press.jpg',
    videoUrl: 'https://example.com/videos/barbell-bench-press.mp4',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on a bench with a barbell at chest level. Grip the bar with hands slightly wider than shoulder-width. Push the bar up until your arms are fully extended. Lower the bar back to the starting position. Repeat.',
  },
  {
    name: 'Pull-up',
    thumbnailUrl: '/exercises/pull-up.jpg',
    videoUrl: 'https://example.com/videos/pull-up.mp4',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Pull-up Bar',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Hang from a pull-up bar with palms facing away from you. Pull your body up until your chin is above the bar. Lower yourself back down with control. Repeat.',
  },
  {
    name: 'Dumbbell Row',
    thumbnailUrl: '/exercises/dumbbell-row.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-row.mp4',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Place one knee and hand on a bench, other foot on the ground. Hold a dumbbell in your free hand, arm extended. Pull the dumbbell up to your chest, then lower it back down. Repeat, then switch sides.',
  },
  {
    name: 'Deadlift',
    thumbnailUrl: '/exercises/deadlift.jpg',
    videoUrl: 'https://example.com/videos/deadlift.mp4',
    muscleGroups: ['Back', 'Glutes', 'Hamstrings'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with feet hip-width apart, barbell on the floor. Bend at hips and knees to lower your body and grasp the bar. Lift the bar by extending hips and knees to full extension. Lower the bar to the floor and repeat.',
  },
  {
    name: 'Shoulder Press',
    thumbnailUrl: '/exercises/shoulder-press.jpg',
    videoUrl: 'https://example.com/videos/shoulder-press.mp4',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with feet shoulder-width apart, holding dumbbells at shoulder height. Press the weights overhead until arms are fully extended. Lower the weights back to shoulder height and repeat.',
  },
  {
    name: 'Bicep Curl',
    thumbnailUrl: '/exercises/bicep-curl.jpg',
    videoUrl: 'https://example.com/videos/bicep-curl.mp4',
    muscleGroups: ['Biceps'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with feet shoulder-width apart, holding dumbbells at your sides. Keeping your upper arms stationary, curl the weights up to shoulder level. Lower the weights back down and repeat.',
  },
  {
    name: 'Tricep Dips',
    thumbnailUrl: '/exercises/tricep-dips.jpg',
    videoUrl: 'https://example.com/videos/tricep-dips.mp4',
    muscleGroups: ['Triceps', 'Chest'],
    equipment: 'Parallel Bars',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Grip parallel bars with arms straight. Lower your body by bending your arms, keeping your elbows close to your body. Push back up to the starting position and repeat.',
  },
  {
    name: 'Leg Press',
    thumbnailUrl: '/exercises/leg-press.jpg',
    videoUrl: 'https://example.com/videos/leg-press.mp4',
    muscleGroups: ['Quadriceps', 'Hamstrings', 'Glutes'],
    equipment: 'Leg Press Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      "Sit in the leg press machine with your feet on the platform shoulder-width apart. Lower the platform by bending your knees until they're at 90 degrees. Push the platform back up to the starting position and repeat.",
  },
  {
    name: 'Calf Raises',
    thumbnailUrl: '/exercises/calf-raises.jpg',
    videoUrl: 'https://example.com/videos/calf-raises.mp4',
    muscleGroups: ['Calves'],
    equipment: 'None',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with the balls of your feet on a raised platform. Raise your heels as high as possible. Lower your heels below the platform and repeat.',
  },
  {
    name: 'Russian Twists',
    thumbnailUrl: '/exercises/russian-twists.jpg',
    videoUrl: 'https://example.com/videos/russian-twists.mp4',
    muscleGroups: ['Core', 'Obliques'],
    equipment: 'None',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      "Sit on the floor with knees bent and feet off the ground. Lean back slightly, keeping your back straight. Twist your torso to the right, then to the left. That's one rep. Repeat.",
  },
  {
    name: 'Jumping Jacks',
    thumbnailUrl: '/exercises/jumping-jacks.jpg',
    videoUrl: 'https://example.com/videos/jumping-jacks.mp4',
    muscleGroups: ['Full Body'],
    equipment: 'None',
    type: ExerciseType.CARDIO,
    mode: ExerciseMode.TIME,
    instructions:
      'Start standing with arms at your sides. Jump your feet out to the sides while simultaneously raising your arms above your head. Jump back to the starting position and repeat.',
  },
  {
    name: 'High Knees',
    thumbnailUrl: '/exercises/high-knees.jpg',
    videoUrl: 'https://example.com/videos/high-knees.mp4',
    muscleGroups: ['Legs', 'Core'],
    equipment: 'None',
    type: ExerciseType.CARDIO,
    mode: ExerciseMode.TIME,
    instructions:
      'Stand in place and run, lifting your knees high towards your chest. Pump your arms as you run. Continue at a fast pace.',
  },
  {
    name: 'Bicycle Crunches',
    thumbnailUrl: '/exercises/bicycle-crunches.jpg',
    videoUrl: 'https://example.com/videos/bicycle-crunches.mp4',
    muscleGroups: ['Core', 'Obliques'],
    equipment: 'None',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on your back with hands behind your head. Lift shoulders off the ground and bring right elbow to left knee while extending right leg. Switch sides, bringing left elbow to right knee. Continue alternating.',
  },
  {
    name: 'Lat Pulldown',
    thumbnailUrl: '/exercises/lat-pulldown.jpg',
    videoUrl: 'https://example.com/videos/lat-pulldown.mp4',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit at a lat pulldown machine with a wide grip on the bar. Pull the bar down to your chest, squeezing your shoulder blades together. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Leg Curl',
    thumbnailUrl: '/exercises/leg-curl.jpg',
    videoUrl: 'https://example.com/videos/leg-curl.mp4',
    muscleGroups: ['Hamstrings'],
    equipment: 'Leg Curl Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie face down on a leg curl machine with your ankles against the pad. Curl your legs up, bringing your heels towards your buttocks. Slowly lower back to the starting position and repeat.',
  },
  {
    name: 'Dumbbell Flyes',
    thumbnailUrl: '/exercises/dumbbell-flyes.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-flyes.mp4',
    muscleGroups: ['Chest'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on a bench with a dumbbell in each hand, arms extended above your chest. Lower the dumbbells out to the sides in a wide arc until you feel a stretch in your chest. Bring the dumbbells back up to the starting position and repeat.',
  },
  {
    name: 'Tricep Pushdown',
    thumbnailUrl: '/exercises/tricep-pushdown.jpg',
    videoUrl: 'https://example.com/videos/tricep-pushdown.mp4',
    muscleGroups: ['Triceps'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand facing a high pulley with a straight bar attachment. Grasp the bar with palms facing down. Keeping your upper arms close to your body, push the bar down until your arms are fully extended. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Seated Cable Row',
    thumbnailUrl: '/exercises/seated-cable-row.jpg',
    videoUrl: 'https://example.com/videos/seated-cable-row.mp4',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit at a cable row machine with your feet on the platform and knees slightly bent. Grasp the handle with both hands. Pull the handle towards your lower abdomen while keeping your back straight. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Leg Extension',
    thumbnailUrl: '/exercises/leg-extension.jpg',
    videoUrl: 'https://example.com/videos/leg-extension.mp4',
    muscleGroups: ['Quadriceps'],
    equipment: 'Leg Extension Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit on a leg extension machine with your legs under the pad. Extend your legs to the maximum as you exhale. Pause briefly, then lower the weight back to the starting position as you inhale. Repeat for the desired number of repetitions.',
  },
  {
    name: 'Hammer Curl',
    thumbnailUrl: '/exercises/hammer-curl.jpg',
    videoUrl: 'https://example.com/videos/hammer-curl.mp4',
    muscleGroups: ['Biceps', 'Forearms'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand holding dumbbells at your sides with palms facing your body. Keeping your upper arms stationary, curl the weights while keeping your palms facing your torso. Lower back down and repeat.',
  },
  {
    name: 'Dumbbell Lateral Raise',
    thumbnailUrl: '/exercises/dumbbell-lateral-raise.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-lateral-raise.mp4',
    muscleGroups: ['Shoulders'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      "Stand with dumbbells at your sides. Keeping your arms straight, raise the dumbbells out to the sides until they're at shoulder level. Lower back down and repeat.",
  },
  {
    name: 'Barbell Row',
    thumbnailUrl: '/exercises/barbell-row.jpg',
    videoUrl: 'https://example.com/videos/barbell-row.mp4',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      "Bend at the hips and knees, lowering your torso until it's almost parallel to the floor. Grasp the barbell with an overhand grip. Pull the bar to your lower chest, squeezing your shoulder blades together. Lower the bar back down and repeat.",
  },
  {
    name: 'Dips',
    thumbnailUrl: '/exercises/dips.jpg',
    videoUrl: 'https://example.com/videos/dips.mp4',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    equipment: 'Parallel Bars',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Grip parallel bars with arms straight and shoulders above your hands. Lower your body by bending your elbows until your upper arms are parallel to the ground. Push back up to the starting position and repeat.',
  },
  {
    name: 'Front Squat',
    thumbnailUrl: '/exercises/front-squat.jpg',
    videoUrl: 'https://example.com/videos/front-squat.mp4',
    muscleGroups: ['Quadriceps', 'Glutes', 'Core'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Rest a barbell on your upper chest, gripping it with your fingertips. Squat down, keeping your elbows high and your upper arms parallel to the ground. Stand back up and repeat.',
  },
  {
    name: 'Incline Bench Press',
    thumbnailUrl: '/exercises/incline-bench-press.jpg',
    videoUrl: 'https://example.com/videos/incline-bench-press.mp4',
    muscleGroups: ['Upper Chest', 'Shoulders', 'Triceps'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on an incline bench set to 15-30 degrees. Grip the barbell with hands slightly wider than shoulder-width. Lower the bar to your upper chest, then press it back up to the starting position. Repeat.',
  },
  {
    name: 'Romanian Deadlift',
    thumbnailUrl: '/exercises/romanian-deadlift.jpg',
    videoUrl: 'https://example.com/videos/romanian-deadlift.mp4',
    muscleGroups: ['Hamstrings', 'Lower Back', 'Glutes'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with feet hip-width apart, holding a barbell in front of your thighs. Hinge at the hips, lowering the bar along your legs while keeping your back straight. Feel a stretch in your hamstrings, then return to the starting position. Repeat.',
  },
  {
    name: 'Skull Crushers',
    thumbnailUrl: '/exercises/skull-crushers.jpg',
    videoUrl: 'https://example.com/videos/skull-crushers.mp4',
    muscleGroups: ['Triceps'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on a bench holding a barbell with arms extended above your chest. Bend your elbows to lower the bar towards your forehead. Extend your arms to return to the starting position. Repeat.',
  },
  {
    name: 'Seated Dumbbell Shoulder Press',
    thumbnailUrl: '/exercises/seated-dumbbell-shoulder-press.jpg',
    videoUrl: 'https://example.com/videos/seated-dumbbell-shoulder-press.mp4',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit on a bench with back support. Hold a dumbbell in each hand at shoulder height. Press the dumbbells overhead until your arms are fully extended. Lower the weights back to shoulder height and repeat.',
  },
  {
    name: 'Barbell Hip Thrust',
    thumbnailUrl: '/exercises/barbell-hip-thrust.jpg',
    videoUrl: 'https://example.com/videos/barbell-hip-thrust.mp4',
    muscleGroups: ['Glutes', 'Hamstrings'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit on the ground with your upper back against a bench, knees bent, and feet flat on the floor. Place a barbell over your hips. Drive your hips up, squeezing your glutes at the top. Lower back down and repeat.',
  },
  {
    name: 'Face Pull',
    thumbnailUrl: '/exercises/face-pull.jpg',
    videoUrl: 'https://example.com/videos/face-pull.mp4',
    muscleGroups: ['Rear Deltoids', 'Upper Back'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Attach a rope to a high pulley. Grasp the rope with both hands and step back. Pull the rope towards your face, separating your hands as you do so. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Reverse Flyes',
    thumbnailUrl: '/exercises/reverse-flyes.jpg',
    videoUrl: 'https://example.com/videos/reverse-flyes.mp4',
    muscleGroups: ['Rear Deltoids', 'Upper Back'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      "Bend at the hips with a slight bend in your knees, back straight. Hold dumbbells down towards the floor. Raise the dumbbells out to the sides until they're in line with your shoulders. Lower back down and repeat.",
  },
  {
    name: 'Leg Press Calf Raise',
    thumbnailUrl: '/exercises/leg-press-calf-raise.jpg',
    videoUrl: 'https://example.com/videos/leg-press-calf-raise.mp4',
    muscleGroups: ['Calves'],
    equipment: 'Leg Press Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit in a leg press machine with the balls of your feet on the lower edge of the platform. Push the platform up slightly to release the safety locks. Lower your heels as far as possible, then raise them as high as you can. Repeat.',
  },
  {
    name: 'Hanging Leg Raise',
    thumbnailUrl: '/exercises/hanging-leg-raise.jpg',
    videoUrl: 'https://example.com/videos/hanging-leg-raise.mp4',
    muscleGroups: ['Lower Abs'],
    equipment: 'Pull-up Bar',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      "Hang from a pull-up bar with arms fully extended. Keeping your legs straight, raise them until they're parallel to the ground. Lower them back down slowly and repeat.",
  },
  {
    name: 'Cable Woodchopper',
    thumbnailUrl: '/exercises/cable-woodchopper.jpg',
    videoUrl: 'https://example.com/videos/cable-woodchopper.mp4',
    muscleGroups: ['Obliques', 'Core'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Set a cable pulley to chest height. Stand sideways to the machine, grasping the handle with both hands. Rotate your torso, pulling the handle down and across your body to the opposite hip. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Barbell Shrug',
    thumbnailUrl: '/exercises/barbell-shrug.jpg',
    videoUrl: 'https://example.com/videos/barbell-shrug.mp4',
    muscleGroups: ['Trapezius'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand holding a barbell with your hands just beyond shoulder-width apart. Lift your shoulders as high as possible. Hold briefly, then lower back down and repeat.',
  },
  {
    name: 'Seated Leg Curl',
    thumbnailUrl: '/exercises/seated-leg-curl.jpg',
    videoUrl: 'https://example.com/videos/seated-leg-curl.mp4',
    muscleGroups: ['Hamstrings'],
    equipment: 'Leg Curl Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit in the leg curl machine with your legs extended and the pad resting on your lower calves. Curl your legs back as far as possible by bending your knees. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Dumbbell Pullover',
    thumbnailUrl: '/exercises/dumbbell-pullover.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-pullover.mp4',
    muscleGroups: ['Chest', 'Lats'],
    equipment: 'Dumbbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on a bench holding a dumbbell with both hands above your chest. Lower the dumbbell behind your head in an arc, keeping a slight bend in your elbows. Bring the dumbbell back to the starting position and repeat.',
  },
  {
    name: 'Barbell Curl',
    thumbnailUrl: '/exercises/barbell-curl.jpg',
    videoUrl: 'https://example.com/videos/barbell-curl.mp4',
    muscleGroups: ['Biceps'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand holding a barbell with an underhand grip, hands shoulder-width apart. Keeping your upper arms stationary, curl the bar up to shoulder level. Lower the bar back down and repeat.',
  },
  {
    name: 'Decline Bench Press',
    thumbnailUrl: '/exercises/decline-bench-press.jpg',
    videoUrl: 'https://example.com/videos/decline-bench-press.mp4',
    muscleGroups: ['Lower Chest', 'Triceps'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on a decline bench with your head lower than your feet. Grip the barbell with hands slightly wider than shoulder-width. Lower the bar to your lower chest, then press it back up to the starting position. Repeat.',
  },
  {
    name: 'Seated Calf Raise',
    thumbnailUrl: '/exercises/seated-calf-raise.jpg',
    videoUrl: 'https://example.com/videos/seated-calf-raise.mp4',
    muscleGroups: ['Calves'],
    equipment: 'Seated Calf Raise Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit in the machine with the balls of your feet on the footplate and your knees under the pad. Raise your heels as high as possible. Lower your heels back down and repeat.',
  },
  {
    name: 'Dumbbell Lunges',
    thumbnailUrl: '/exercises/dumbbell-lunges.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-lunges.mp4',
    muscleGroups: ['Quadriceps', 'Hamstrings', 'Glutes'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with dumbbells at your sides. Step forward with one leg and lower your hips until both knees are bent at 90-degree angles. Push back to the starting position and repeat with the other leg.',
  },
  {
    name: 'Lat Pulldown Behind the Neck',
    thumbnailUrl: '/exercises/lat-pulldown-behind-neck.jpg',
    videoUrl: 'https://example.com/videos/lat-pulldown-behind-neck.mp4',
    muscleGroups: ['Back', 'Shoulders'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit at a lat pulldown machine with a wide grip on the bar. Pull the bar down behind your neck to your upper back. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Dumbbell Wrist Curl',
    thumbnailUrl: '/exercises/dumbbell-wrist-curl.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-wrist-curl.mp4',
    muscleGroups: ['Forearms'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit on a bench holding a dumbbell in each hand with your forearms resting on your thighs, palms up. Let the dumbbells roll to your fingertips, then curl them back up. Repeat.',
  },
  {
    name: 'Cable Crunch',
    thumbnailUrl: '/exercises/cable-crunch.jpg',
    videoUrl: 'https://example.com/videos/cable-crunch.mp4',
    muscleGroups: ['Abs'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Kneel in front of a high pulley and grasp the rope attachment. Keep your hips stationary and curl your torso down, bringing your elbows towards your thighs. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Reverse Crunch',
    thumbnailUrl: '/exercises/reverse-crunch.jpg',
    videoUrl: 'https://example.com/videos/reverse-crunch.mp4',
    muscleGroups: ['Lower Abs'],
    equipment: 'None',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on your back with your knees bent and feet flat on the floor. Place your hands by your sides, palms down. Lift your hips off the floor, bringing your knees towards your chest. Lower back down and repeat.',
  },
  {
    name: 'Dumbbell Front Raise',
    thumbnailUrl: '/exercises/dumbbell-front-raise.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-front-raise.mp4',
    muscleGroups: ['Front Deltoids'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand holding dumbbells in front of your thighs. Keeping your arms straight, raise the dumbbells in front of you to shoulder height. Lower back down and repeat.',
  },
  {
    name: 'Barbell Good Morning',
    thumbnailUrl: '/exercises/barbell-good-morning.jpg',
    videoUrl: 'https://example.com/videos/barbell-good-morning.mp4',
    muscleGroups: ['Lower Back', 'Hamstrings'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      "Stand with a barbell across your upper back. Keeping your back straight, bend at the hips to lower your torso until it's nearly parallel to the floor. Return to the upright position and repeat.",
  },
  {
    name: 'Dumbbell Tricep Kickback',
    thumbnailUrl: '/exercises/dumbbell-tricep-kickback.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-tricep-kickback.mp4',
    muscleGroups: ['Triceps'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Bend at the waist with a dumbbell in each hand, upper arms parallel to your torso. Extend your arms back, straightening your elbows. Return to the starting position and repeat.',
  },
  {
    name: 'Barbell Upright Row',
    thumbnailUrl: '/exercises/barbell-upright-row.jpg',
    videoUrl: 'https://example.com/videos/barbell-upright-row.mp4',
    muscleGroups: ['Shoulders', 'Trapezius'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand holding a barbell with an overhand grip, hands closer than shoulder-width. Lift the barbell straight up towards your chin, leading with your elbows. Lower back down and repeat.',
  },
  {
    name: 'Dumbbell Concentration Curl',
    thumbnailUrl: '/exercises/dumbbell-concentration-curl.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-concentration-curl.mp4',
    muscleGroups: ['Biceps'],
    equipment: 'Dumbbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit on a bench with your legs spread, holding a dumbbell in one hand. Rest your elbow on the inner thigh of the same side. Curl the weight up towards your shoulder, then lower it back down. Complete all reps, then switch arms.',
  },
  {
    name: 'Machine Chest Fly',
    thumbnailUrl: '/exercises/machine-chest-fly.jpg',
    videoUrl: 'https://example.com/videos/machine-chest-fly.mp4',
    muscleGroups: ['Chest'],
    equipment: 'Chest Fly Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit in the machine with your back against the pad. Grasp the handles and bring them together in front of your chest, squeezing your chest muscles. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Barbell Calf Raise',
    thumbnailUrl: '/exercises/barbell-calf-raise.jpg',
    videoUrl: 'https://example.com/videos/barbell-calf-raise.mp4',
    muscleGroups: ['Calves'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with a barbell across your upper back, balls of your feet on a raised platform. Raise your heels as high as possible. Lower your heels below the platform and repeat.',
  },
  {
    name: 'Dumbbell Bulgarian Split Squat',
    thumbnailUrl: '/exercises/dumbbell-bulgarian-split-squat.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-bulgarian-split-squat.mp4',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand a few feet in front of a bench, holding dumbbells at your sides. Place one foot on the bench behind you. Lower your body until your rear knee nearly touches the ground and your front thigh is parallel to the ground. Push back up to the starting position and repeat. Switch legs after completing all reps.',
  },
  {
    name: 'Cable Lateral Raise',
    thumbnailUrl: '/exercises/cable-lateral-raise.jpg',
    videoUrl: 'https://example.com/videos/cable-lateral-raise.mp4',
    muscleGroups: ['Shoulders'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      "Stand sideways to a low pulley, holding the cable handle in the hand furthest from the machine. Keeping your arm straight, raise it out to the side until it's at shoulder level. Lower back down and repeat.",
  },
  {
    name: 'Barbell Hack Squat',
    thumbnailUrl: '/exercises/barbell-hack-squat.jpg',
    videoUrl: 'https://example.com/videos/barbell-hack-squat.mp4',
    muscleGroups: ['Quadriceps', 'Glutes'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with a barbell behind your legs, feet shoulder-width apart. Squat down and grasp the bar with an overhand grip. Stand up, lifting the bar as you do. Lower the bar back down and repeat.',
  },
  {
    name: 'Dumbbell Reverse Fly',
    thumbnailUrl: '/exercises/dumbbell-reverse-fly.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-reverse-fly.mp4',
    muscleGroups: ['Rear Deltoids', 'Upper Back'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      "Bend at the hips with a slight bend in your knees, back straight. Hold dumbbells down towards the floor. Raise the dumbbells out to the sides until they're in line with your shoulders. Lower back down and repeat.",
  },
  {
    name: 'Machine Shoulder Press',
    thumbnailUrl: '/exercises/machine-shoulder-press.jpg',
    videoUrl: 'https://example.com/videos/machine-shoulder-press.mp4',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: 'Shoulder Press Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit in the machine with the handles at shoulder level. Press the handles overhead until your arms are fully extended. Lower back down to shoulder level and repeat.',
  },
  {
    name: 'Barbell Preacher Curl',
    thumbnailUrl: '/exercises/barbell-preacher-curl.jpg',
    videoUrl: 'https://example.com/videos/barbell-preacher-curl.mp4',
    muscleGroups: ['Biceps'],
    equipment: 'Barbell, Preacher Bench',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit at a preacher bench with your armpits just touching the top of the sloped section. Grasp a barbell with an underhand grip. Starting with your arms fully extended, curl the bar up towards your shoulders. Lower back down and repeat.',
  },
  {
    name: 'Cable Tricep Extension',
    thumbnailUrl: '/exercises/cable-tricep-extension.jpg',
    videoUrl: 'https://example.com/videos/cable-tricep-extension.mp4',
    muscleGroups: ['Triceps'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand facing away from a high pulley with a rope attachment. Bend forward slightly at the waist with elbows bent and tucked at your sides. Extend your arms, pushing the rope down towards your thighs. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Dumbbell Incline Bench Press',
    thumbnailUrl: '/exercises/dumbbell-incline-bench-press.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-incline-bench-press.mp4',
    muscleGroups: ['Upper Chest', 'Shoulders', 'Triceps'],
    equipment: 'Dumbbells, Incline Bench',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on an incline bench set to 15-30 degrees, holding a dumbbell in each hand at chest level. Press the dumbbells up until your arms are fully extended. Lower the weights back to chest level and repeat.',
  },
  {
    name: 'Barbell Bent Over Row',
    thumbnailUrl: '/exercises/barbell-bent-over-row.jpg',
    videoUrl: 'https://example.com/videos/barbell-bent-over-row.mp4',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      "Bend at the hips and knees, lowering your torso until it's almost parallel to the floor. Hold a barbell with an overhand grip, hands just beyond shoulder-width apart. Pull the bar to your lower chest, squeezing your shoulder blades together. Lower the bar back down and repeat.",
  },
  {
    name: 'Machine Leg Press',
    thumbnailUrl: '/exercises/machine-leg-press.jpg',
    videoUrl: 'https://example.com/videos/machine-leg-press.mp4',
    muscleGroups: ['Quadriceps', 'Hamstrings', 'Glutes'],
    equipment: 'Leg Press Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit in the leg press machine with your feet on the platform shoulder-width apart. Release the safety bars and lower the platform until your knees are bent at about 90 degrees. Push the platform back up to the starting position. Repeat.',
  },
  {
    name: 'Dumbbell Shrug',
    thumbnailUrl: '/exercises/dumbbell-shrug.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-shrug.mp4',
    muscleGroups: ['Trapezius'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand holding a dumbbell in each hand at your sides. Lift your shoulders as high as possible. Hold briefly, then lower back down and repeat.',
  },
  {
    name: 'Cable Bicep Curl',
    thumbnailUrl: '/exercises/cable-bicep-curl.jpg',
    videoUrl: 'https://example.com/videos/cable-bicep-curl.mp4',
    muscleGroups: ['Biceps'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand facing a low pulley with a straight bar attachment. Grasp the bar with an underhand grip, hands shoulder-width apart. Keeping your upper arms stationary, curl the bar up towards your shoulders. Lower the bar back down and repeat.',
  },
  {
    name: 'Barbell Skull Crusher',
    thumbnailUrl: '/exercises/barbell-skull-crusher.jpg',
    videoUrl: 'https://example.com/videos/barbell-skull-crusher.mp4',
    muscleGroups: ['Triceps'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on a bench holding a barbell with arms extended above your chest. Bend your elbows to lower the bar towards your forehead. Extend your arms to return to the starting position. Repeat.',
  },
  {
    name: 'Machine Pec Deck',
    thumbnailUrl: '/exercises/machine-pec-deck.jpg',
    videoUrl: 'https://example.com/videos/machine-pec-deck.mp4',
    muscleGroups: ['Chest'],
    equipment: 'Pec Deck Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit in the machine with your back flat against the pad. Grasp the handles and bring them together in front of your chest, squeezing your chest muscles. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Dumbbell Romanian Deadlift',
    thumbnailUrl: '/exercises/dumbbell-romanian-deadlift.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-romanian-deadlift.mp4',
    muscleGroups: ['Hamstrings', 'Lower Back', 'Glutes'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with feet hip-width apart, holding dumbbells in front of your thighs. Hinge at the hips, lowering the dumbbells along your legs while keeping your back straight. Feel a stretch in your hamstrings, then return to the starting position. Repeat.',
  },
  {
    name: 'Cable Face Pull',
    thumbnailUrl: '/exercises/cable-face-pull.jpg',
    videoUrl: 'https://example.com/videos/cable-face-pull.mp4',
    muscleGroups: ['Rear Deltoids', 'Upper Back'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Attach a rope to a high pulley. Grasp the rope with both hands and step back. Pull the rope towards your face, separating your hands as you do so. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Barbell Lunge',
    thumbnailUrl: '/exercises/barbell-lunge.jpg',
    videoUrl: 'https://example.com/videos/barbell-lunge.mp4',
    muscleGroups: ['Quadriceps', 'Hamstrings', 'Glutes'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with a barbell across your upper back. Step forward with one leg and lower your hips until both knees are bent at 90-degree angles. Push back to the starting position and repeat with the other leg.',
  },
  {
    name: 'Dumbbell Fly',
    thumbnailUrl: '/exercises/dumbbell-fly.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-fly.mp4',
    muscleGroups: ['Chest'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on a flat bench with a dumbbell in each hand, arms extended above your chest. Lower the dumbbells out to the sides in a wide arc until you feel a stretch in your chest. Bring the dumbbells back up to the starting position and repeat.',
  },
  {
    name: 'Cable Pullover',
    thumbnailUrl: '/exercises/cable-pullover.jpg',
    videoUrl: 'https://example.com/videos/cable-pullover.mp4',
    muscleGroups: ['Chest', 'Lats'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Kneel facing away from a high pulley. Grasp the cable attachment with both hands above your head. Keeping your arms slightly bent, bring the cable down in an arc to your thighs. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Machine Calf Raise',
    thumbnailUrl: '/exercises/machine-calf-raise.jpg',
    videoUrl: 'https://example.com/videos/machine-calf-raise.mp4',
    muscleGroups: ['Calves'],
    equipment: 'Calf Raise Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand in the machine with your shoulders under the pads and the balls of your feet on the footplate. Raise your heels as high as possible. Lower your heels back down and repeat.',
  },
  {
    name: 'Barbell Wrist Curl',
    thumbnailUrl: '/exercises/barbell-wrist-curl.jpg',
    videoUrl: 'https://example.com/videos/barbell-wrist-curl.mp4',
    muscleGroups: ['Forearms'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit on a bench with your forearms resting on your thighs, palms up, holding a barbell. Let the barbell roll to your fingertips, then curl it back up. Repeat.',
  },
  {
    name: 'Ab Wheel Rollout',
    thumbnailUrl: '/exercises/ab-wheel-rollout.jpg',
    videoUrl: 'https://example.com/videos/ab-wheel-rollout.mp4',
    muscleGroups: ['Abs', 'Core'],
    equipment: 'Ab Wheel',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Kneel on the floor holding an ab wheel in front of you. Roll the wheel forward, extending your body as far as you can without touching the ground. Roll back to the starting position and repeat.',
  },
  {
    name: 'Dumbbell Goblet Squat',
    thumbnailUrl: '/exercises/dumbbell-goblet-squat.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-goblet-squat.mp4',
    muscleGroups: ['Quadriceps', 'Glutes', 'Core'],
    equipment: 'Dumbbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with feet shoulder-width apart, holding a dumbbell close to your chest with both hands. Lower your body as if sitting back into a chair. Keep your chest up and weight in your heels. Push back up to the starting position and repeat.',
  },
  {
    name: 'Barbell Reverse Curl',
    thumbnailUrl: '/exercises/barbell-reverse-curl.jpg',
    videoUrl: 'https://example.com/videos/barbell-reverse-curl.mp4',
    muscleGroups: ['Biceps', 'Forearms'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand holding a barbell with an overhand grip, hands shoulder-width apart. Keeping your upper arms stationary, curl the bar up towards your shoulders. Lower the bar back down and repeat.',
  },
  {
    name: 'Machine Seated Row',
    thumbnailUrl: '/exercises/machine-seated-row.jpg',
    videoUrl: 'https://example.com/videos/machine-seated-row.mp4',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Seated Row Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit at the machine with your feet on the footrests and grasp the handles. Pull the handles towards your abdomen, squeezing your shoulder blades together. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Dumbbell Tricep Extension',
    thumbnailUrl: '/exercises/dumbbell-tricep-extension.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-tricep-extension.mp4',
    muscleGroups: ['Triceps'],
    equipment: 'Dumbbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand or sit holding a dumbbell with both hands above your head, arms fully extended. Lower the dumbbell behind your head by bending your elbows. Extend your arms back up to the starting position and repeat.',
  },
  {
    name: 'Cable Crossover',
    thumbnailUrl: '/exercises/cable-crossover.jpg',
    videoUrl: 'https://example.com/videos/cable-crossover.mp4',
    muscleGroups: ['Chest'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand between two high pulleys. Grasp a handle in each hand and step forward. With a slight bend in your elbows, bring your hands together in front of your chest. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Barbell Sumo Deadlift',
    thumbnailUrl: '/exercises/barbell-sumo-deadlift.jpg',
    videoUrl: 'https://example.com/videos/barbell-sumo-deadlift.mp4',
    muscleGroups: ['Quadriceps', 'Hamstrings', 'Glutes', 'Lower Back'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with feet wider than shoulder-width, toes pointing out. Bend at the hips and knees to lower your body and grasp the barbell with hands inside your legs. Lift the bar by extending your hips and knees to full extension. Lower the bar to the floor and repeat.',
  },
  {
    name: 'Machine Leg Extension',
    thumbnailUrl: '/exercises/machine-leg-extension.jpg',
    videoUrl: 'https://example.com/videos/machine-leg-extension.mp4',
    muscleGroups: ['Quadriceps'],
    equipment: 'Leg Extension Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit on the machine with your legs under the pad. Extend your legs to the maximum as you exhale. Pause briefly, then lower the weight back to the starting position as you inhale. Repeat for the desired number of repetitions.',
  },
  {
    name: 'Dumbbell Alternating Curl',
    thumbnailUrl: '/exercises/dumbbell-alternating-curl.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-alternating-curl.mp4',
    muscleGroups: ['Biceps'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with a dumbbell in each hand at your sides. Curl one dumbbell up towards your shoulder while keeping the other arm straight. Lower the dumbbell back down and repeat with the other arm. Continue alternating arms.',
  },
  {
    name: 'Barbell Front Raise',
    thumbnailUrl: '/exercises/barbell-front-raise.jpg',
    videoUrl: 'https://example.com/videos/barbell-front-raise.mp4',
    muscleGroups: ['Front Deltoids'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand holding a barbell in front of your thighs with an overhand grip. Keeping your arms straight, raise the barbell in front of you to shoulder height. Lower back down and repeat.',
  },
  {
    name: 'Cable Rope Hammer Curl',
    thumbnailUrl: '/exercises/cable-rope-hammer-curl.jpg',
    videoUrl: 'https://example.com/videos/cable-rope-hammer-curl.mp4',
    muscleGroups: ['Biceps', 'Forearms'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand facing a low pulley with a rope attachment. Grasp the rope with palms facing each other. Keeping your upper arms stationary, curl the rope up towards your shoulders. Lower back down and repeat.',
  },
  {
    name: 'Machine Chest Press',
    thumbnailUrl: '/exercises/machine-chest-press.jpg',
    videoUrl: 'https://example.com/videos/machine-chest-press.mp4',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    equipment: 'Chest Press Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit in the machine with your hands on the handles at chest level. Push the handles forward until your arms are fully extended. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Dumbbell Step-Up',
    thumbnailUrl: '/exercises/dumbbell-step-up.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-step-up.mp4',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: 'Dumbbells, Bench or Step',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      "Stand holding dumbbells at your sides, facing a bench or step. Step onto the bench with one foot, driving your other foot up so you're standing on the bench. Step back down and repeat, alternating legs.",
  },
  {
    name: 'Barbell Close-Grip Bench Press',
    thumbnailUrl: '/exercises/barbell-close-grip-bench-press.jpg',
    videoUrl: 'https://example.com/videos/barbell-close-grip-bench-press.mp4',
    muscleGroups: ['Triceps', 'Chest'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on a bench with a barbell held above your chest, hands about shoulder-width apart. Lower the bar to your lower chest, keeping your elbows close to your body. Press the bar back up to the starting position and repeat.',
  },
  {
    name: 'Cable Lateral Pulldown',
    thumbnailUrl: '/exercises/cable-lateral-pulldown.jpg',
    videoUrl: 'https://example.com/videos/cable-lateral-pulldown.mp4',
    muscleGroups: ['Lats', 'Biceps'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit at a lat pulldown machine with a wide grip on the bar. Pull the bar down to your upper chest, squeezing your shoulder blades together. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Dumbbell Reverse Lunge',
    thumbnailUrl: '/exercises/dumbbell-reverse-lunge.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-reverse-lunge.mp4',
    muscleGroups: ['Quadriceps', 'Hamstrings', 'Glutes'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand holding dumbbells at your sides. Step backward with one leg and lower your hips until both knees are bent at 90-degree angles. Push back up to the starting position and repeat with the other leg.',
  },
  {
    name: 'Machine Shoulder Press',
    thumbnailUrl: '/exercises/machine-shoulder-press.jpg',
    videoUrl: 'https://example.com/videos/machine-shoulder-press.mp4',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: 'Shoulder Press Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit in the machine with the handles at shoulder level. Press the handles overhead until your arms are fully extended. Lower back down to shoulder level and repeat.',
  },
  {
    name: 'Barbell Hip Thrust',
    thumbnailUrl: '/exercises/barbell-hip-thrust.jpg',
    videoUrl: 'https://example.com/videos/barbell-hip-thrust.mp4',
    muscleGroups: ['Glutes', 'Hamstrings'],
    equipment: 'Barbell, Bench',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit on the ground with your upper back against a bench, knees bent, and feet flat on the floor. Place a barbell over your hips. Drive your hips up, squeezing your glutes at the top. Lower back down and repeat.',
  },
  {
    name: 'Cable Tricep Pushdown',
    thumbnailUrl: '/exercises/cable-tricep-pushdown.jpg',
    videoUrl: 'https://example.com/videos/cable-tricep-pushdown.mp4',
    muscleGroups: ['Triceps'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand facing a high pulley with a straight bar attachment. Grasp the bar with palms facing down. Keeping your upper arms close to your body, push the bar down until your arms are fully extended. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Dumbbell Renegade Row',
    thumbnailUrl: '/exercises/dumbbell-renegade-row.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-renegade-row.mp4',
    muscleGroups: ['Back', 'Core', 'Shoulders'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      "Start in a push-up position with a dumbbell in each hand. Perform a row by lifting one dumbbell to your side while balancing on the other arm. Lower the dumbbell and repeat on the other side. That's one rep.",
  },
  {
    name: 'Barbell Calf Raise',
    thumbnailUrl: '/exercises/barbell-calf-raise.jpg',
    videoUrl: 'https://example.com/videos/barbell-calf-raise.mp4',
    muscleGroups: ['Calves'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with a barbell across your upper back, balls of your feet on a raised platform. Raise your heels as high as possible. Lower your heels below the platform and repeat.',
  },
  {
    name: 'Machine Leg Curl',
    thumbnailUrl: '/exercises/machine-leg-curl.jpg',
    videoUrl: 'https://example.com/videos/machine-leg-curl.mp4',
    muscleGroups: ['Hamstrings'],
    equipment: 'Leg Curl Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie face down on the leg curl machine with your ankles against the pad. Curl your legs up, bringing your heels towards your buttocks. Slowly lower back to the starting position and repeat.',
  },
  {
    name: 'Dumbbell Chest Supported Row',
    thumbnailUrl: '/exercises/dumbbell-chest-supported-row.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-chest-supported-row.mp4',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Dumbbells, Incline Bench',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie face down on an incline bench set to a 30-45 degree angle. Hold a dumbbell in each hand, arms extended. Pull the dumbbells up to your sides, squeezing your shoulder blades together. Lower back down and repeat.',
  },
  {
    name: 'Cable Upright Row',
    thumbnailUrl: '/exercises/cable-upright-row.jpg',
    videoUrl: 'https://example.com/videos/cable-upright-row.mp4',
    muscleGroups: ['Shoulders', 'Trapezius'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand facing a low pulley with a straight bar attachment. Grasp the bar with an overhand grip, hands closer than shoulder-width. Pull the bar straight up towards your chin, leading with your elbows. Lower back down and repeat.',
  },
  {
    name: 'Barbell Zercher Squat',
    thumbnailUrl: '/exercises/barbell-zercher-squat.jpg',
    videoUrl: 'https://example.com/videos/barbell-zercher-squat.mp4',
    muscleGroups: ['Quadriceps', 'Glutes', 'Core'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Hold a barbell in the crook of your elbows, close to your chest. Squat down, keeping your back straight and chest up. Push through your heels to return to the starting position and repeat.',
  },
  {
    name: 'Dumbbell Farmers Walk',
    thumbnailUrl: '/exercises/dumbbell-farmers-walk.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-farmers-walk.mp4',
    muscleGroups: ['Forearms', 'Trapezius', 'Core'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.DISTANCE,
    instructions:
      'Hold a heavy dumbbell in each hand at your sides. Walk forward for a specified distance or time, maintaining an upright posture and keeping your shoulders back.',
  },
  {
    name: 'Machine Seated Calf Raise',
    thumbnailUrl: '/exercises/machine-seated-calf-raise.jpg',
    videoUrl: 'https://example.com/videos/machine-seated-calf-raise.mp4',
    muscleGroups: ['Calves'],
    equipment: 'Seated Calf Raise Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit in the machine with the balls of your feet on the footplate and your knees under the pad. Raise your heels as high as possible. Lower your heels back down and repeat.',
  },
  {
    name: 'Barbell Floor Press',
    thumbnailUrl: '/exercises/barbell-floor-press.jpg',
    videoUrl: 'https://example.com/videos/barbell-floor-press.mp4',
    muscleGroups: ['Chest', 'Triceps'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on your back on the floor with a barbell held above your chest. Lower the bar until your upper arms touch the floor. Press the bar back up to the starting position and repeat.',
  },
  {
    name: 'Cable Face Pull',
    thumbnailUrl: '/exercises/cable-face-pull.jpg',
    videoUrl: 'https://example.com/videos/cable-face-pull.mp4',
    muscleGroups: ['Rear Deltoids', 'Upper Back'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Attach a rope to a high pulley. Grasp the rope with both hands and step back. Pull the rope towards your face, separating your hands as you do so. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Dumbbell Lateral Lunge',
    thumbnailUrl: '/exercises/dumbbell-lateral-lunge.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-lateral-lunge.mp4',
    muscleGroups: ['Quadriceps', 'Glutes', 'Adductors'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand holding dumbbells at your sides. Take a large step to the side, bending the knee of your stepping leg while keeping the other leg straight. Push off the bent leg to return to the starting position and repeat on the other side.',
  },
  {
    name: 'Machine Pec Deck Fly',
    thumbnailUrl: '/exercises/machine-pec-deck-fly.jpg',
    videoUrl: 'https://example.com/videos/machine-pec-deck-fly.mp4',
    muscleGroups: ['Chest'],
    equipment: 'Pec Deck Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Sit in the machine with your back flat against the pad. Grasp the handles and bring them together in front of your chest, squeezing your chest muscles. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Barbell Rack Pull',
    thumbnailUrl: '/exercises/barbell-rack-pull.jpg',
    videoUrl: 'https://example.com/videos/barbell-rack-pull.mp4',
    muscleGroups: ['Back', 'Glutes', 'Hamstrings'],
    equipment: 'Barbell, Power Rack',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Set up a barbell in a power rack at knee height. Stand with your feet hip-width apart, bend at the hips and knees, and grasp the bar with an overhand grip. Stand up, lifting the bar and driving your hips forward. Lower the bar back to the starting position and repeat.',
  },
  {
    name: 'Cable External Rotation',
    thumbnailUrl: '/exercises/cable-external-rotation.jpg',
    videoUrl: 'https://example.com/videos/cable-external-rotation.mp4',
    muscleGroups: ['Rotator Cuff'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand sideways to a low pulley. Grasp the handle with your outside hand, elbow bent at 90 degrees and tucked to your side. Rotate your forearm outward, keeping your elbow stationary. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Dumbbell Pullover',
    thumbnailUrl: '/exercises/dumbbell-pullover.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-pullover.mp4',
    muscleGroups: ['Chest', 'Lats'],
    equipment: 'Dumbbell, Bench',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on a bench holding a dumbbell with both hands above your chest. Lower the dumbbell behind your head in an arc, keeping a slight bend in your elbows. Bring the dumbbell back to the starting position and repeat.',
  },
  {
    name: 'Barbell Glute Bridge',
    thumbnailUrl: '/exercises/barbell-glute-bridge.jpg',
    videoUrl: 'https://example.com/videos/barbell-glute-bridge.mp4',
    muscleGroups: ['Glutes', 'Hamstrings'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on your back with your knees bent and feet flat on the floor. Place a barbell over your hips. Drive your hips up, squeezing your glutes at the top. Lower your hips back down and repeat.',
  },
  {
    name: 'Machine Reverse Fly',
    thumbnailUrl: '/exercises/machine-reverse-fly.jpg',
    videoUrl: 'https://example.com/videos/machine-reverse-fly.mp4',
    muscleGroups: ['Rear Deltoids', 'Upper Back'],
    equipment: 'Reverse Fly Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      "Sit in the machine with your chest against the pad. Grasp the handles and raise your arms out to the sides until they're in line with your shoulders. Slowly lower back to the starting position and repeat.",
  },
  {
    name: 'Cable Woodchopper',
    thumbnailUrl: '/exercises/cable-woodchopper.jpg',
    videoUrl: 'https://example.com/videos/cable-woodchopper.mp4',
    muscleGroups: ['Obliques', 'Core'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand sideways to a cable machine with the pulley set high. Grasp the handle with both hands and rotate your torso, pulling the handle down and across your body to the opposite hip. Slowly return to the starting position and repeat.',
  },
  {
    name: 'Dumbbell Squeeze Press',
    thumbnailUrl: '/exercises/dumbbell-squeeze-press.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-squeeze-press.mp4',
    muscleGroups: ['Chest', 'Triceps'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Lie on a bench holding two dumbbells over your chest, palms facing each other. Press the dumbbells together and push them up towards the ceiling. Lower the weights back down to your chest while maintaining pressure between them. Repeat.',
  },
  {
    name: 'Barbell Landmine Press',
    thumbnailUrl: '/exercises/barbell-landmine-press.jpg',
    videoUrl: 'https://example.com/videos/barbell-landmine-press.mp4',
    muscleGroups: ['Shoulders', 'Triceps', 'Core'],
    equipment: 'Barbell, Landmine Attachment',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Set up a barbell in a landmine attachment. Stand holding the end of the barbell at shoulder height with one hand. Press the barbell up and away from your body. Lower it back to shoulder height and repeat.',
  },
  {
    name: 'Machine Hack Squat',
    thumbnailUrl: '/exercises/machine-hack-squat.jpg',
    videoUrl: 'https://example.com/videos/machine-hack-squat.mp4',
    muscleGroups: ['Quadriceps', 'Glutes', 'Calves'],
    equipment: 'Hack Squat Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Position yourself in the hack squat machine with your shoulders under the pads. Release the safety bars and lower your body by bending your knees and hips. Push through your feet to return to the starting position and repeat.',
  },
  {
    name: 'Cable Hammer Curl',
    thumbnailUrl: '/exercises/cable-hammer-curl.jpg',
    videoUrl: 'https://example.com/videos/cable-hammer-curl.mp4',
    muscleGroups: ['Biceps', 'Forearms'],
    equipment: 'Cable Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand facing a low pulley with a rope attachment. Grasp the rope with palms facing each other. Keeping your upper arms stationary, curl the rope up towards your shoulders. Lower back down and repeat.',
  },
  {
    name: 'Dumbbell Bent Over Reverse Fly',
    thumbnailUrl: '/exercises/dumbbell-bent-over-reverse-fly.jpg',
    videoUrl: 'https://example.com/videos/dumbbell-bent-over-reverse-fly.mp4',
    muscleGroups: ['Rear Deltoids', 'Upper Back'],
    equipment: 'Dumbbells',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      "Bend at the hips with a slight bend in your knees, back straight. Hold dumbbells down towards the floor. Raise the dumbbells out to the sides until they're in line with your shoulders. Lower back down and repeat.",
  },
  {
    name: 'Barbell Overhead Carry',
    thumbnailUrl: '/exercises/barbell-overhead-carry.jpg',
    videoUrl: 'https://example.com/videos/barbell-overhead-carry.mp4',
    muscleGroups: ['Shoulders', 'Core', 'Trapezius'],
    equipment: 'Barbell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.DISTANCE,
    instructions:
      'Clean and press a barbell overhead. Walk forward for a specified distance or time while keeping the barbell stable overhead. Maintain an upright posture and engage your core throughout the movement.',
  },
  {
    name: 'Machine Assisted Pull-up',
    thumbnailUrl: '/exercises/machine-assisted-pull-up.jpg',
    videoUrl: 'https://example.com/videos/machine-assisted-pull-up.mp4',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Assisted Pull-up Machine',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Adjust the weight on the assisted pull-up machine. Grasp the bar with an overhand grip and place your knees on the pad. Pull yourself up until your chin is over the bar. Lower yourself back down with control and repeat.',
  },
  {
    name: 'Chin-up',
    thumbnailUrl: '/exercises/chin-up.jpg',
    videoUrl: 'https://example.com/videos/chin-up.mp4',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Pull-up Bar',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Hang from a pull-up bar with palms facing towards you, hands shoulder-width apart. Pull your body up until your chin is above the bar. Lower yourself back down with control and repeat.',
  },
  {
    name: 'Box Jump',
    thumbnailUrl: '/exercises/box-jump.jpg',
    videoUrl: 'https://example.com/videos/box-jump.mp4',
    muscleGroups: ['Quadriceps', 'Calves', 'Glutes'],
    equipment: 'Plyometric Box',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand in front of a sturdy box or platform. Bend your knees and swing your arms back, then explosively jump onto the box, landing softly with both feet. Step back down and repeat.',
  },
  {
    name: 'Battle Ropes',
    thumbnailUrl: '/exercises/battle-ropes.jpg',
    videoUrl: 'https://example.com/videos/battle-ropes.mp4',
    muscleGroups: ['Shoulders', 'Arms', 'Core'],
    equipment: 'Battle Ropes',
    type: ExerciseType.CARDIO,
    mode: ExerciseMode.TIME,
    instructions:
      'Stand with feet shoulder-width apart, knees slightly bent, holding one end of the rope in each hand. Alternately raise and lower each arm explosively, creating waves in the ropes. Continue for the desired duration.',
  },
  {
    name: 'Medicine Ball Slam',
    thumbnailUrl: '/exercises/medicine-ball-slam.jpg',
    videoUrl: 'https://example.com/videos/medicine-ball-slam.mp4',
    muscleGroups: ['Core', 'Shoulders', 'Back'],
    equipment: 'Medicine Ball',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with feet shoulder-width apart, holding a medicine ball above your head. Forcefully throw the ball down to the ground in front of you, bending at the hips and knees. Catch the ball on the rebound or pick it up, then return to the starting position and repeat.',
  },
  {
    name: 'Kettlebell Swing',
    thumbnailUrl: '/exercises/kettlebell-swing.jpg',
    videoUrl: 'https://example.com/videos/kettlebell-swing.mp4',
    muscleGroups: ['Glutes', 'Hamstrings', 'Core', 'Shoulders'],
    equipment: 'Kettlebell',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand with feet shoulder-width apart, a kettlebell on the floor in front of you. Hinge at the hips to grip the kettlebell with both hands. Swing the kettlebell back between your legs, then explosively drive your hips forward, swinging the kettlebell up to chest height. Let the kettlebell fall back down and repeat.',
  },
  {
    name: 'TRX Row',
    thumbnailUrl: '/exercises/trx-row.jpg',
    videoUrl: 'https://example.com/videos/trx-row.mp4',
    muscleGroups: ['Back', 'Biceps', 'Core'],
    equipment: 'TRX Suspension Trainer',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Grasp the TRX handles and lean back with arms extended, body straight. Pull your body up towards the handles, keeping your elbows close to your body. Slowly lower back to the starting position and repeat.',
  },
  {
    name: 'Pistol Squat',
    thumbnailUrl: '/exercises/pistol-squat.jpg',
    videoUrl: 'https://example.com/videos/pistol-squat.mp4',
    muscleGroups: ['Quadriceps', 'Glutes', 'Calves'],
    equipment: 'None',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Stand on one leg, extending the other leg in front of you. Slowly lower your body, bending at the knee and hip of your standing leg, while keeping your extended leg off the ground. Lower as far as you can, then push back up to the starting position. Complete all reps on one leg before switching.',
  },
  {
    name: 'Nordic Hamstring Curl',
    thumbnailUrl: '/exercises/nordic-hamstring-curl.jpg',
    videoUrl: 'https://example.com/videos/nordic-hamstring-curl.mp4',
    muscleGroups: ['Hamstrings'],
    equipment: 'Partner or Anchor',
    type: ExerciseType.STRENGTH,
    mode: ExerciseMode.REPS,
    instructions:
      'Kneel on a padded surface with your ankles secured under a fixed object or held by a partner. With a straight body, slowly lower your torso towards the ground, resisting the fall with your hamstrings. Use your arms to catch yourself at the bottom, then push back up to the starting position.',
  },
];

async function main() {
  // Clear existing data
  // await prisma.workoutActivityExercise.deleteMany();
  // await prisma.workoutActivitySet.deleteMany();
  // await prisma.workoutActivity.deleteMany();
  // await prisma.yogaVideoActivity.deleteMany();
  // await prisma.setExercise.deleteMany();
  // await prisma.set.deleteMany();
  // await prisma.workout.deleteMany();
  // await prisma.exercise.deleteMany();
  // await prisma.yogaVideo.deleteMany();
  // await prisma.userExerciseWeight.deleteMany();
  // await prisma.user.deleteMany();

  // Create users
  // const adminUser = await prisma.user.create({
  //   data: {
  //     name: 'Adam Turner',
  //     email: 'adamjamesturner93@gmail.com',
  //     role: UserRole.ADMIN,
  //     membershipStatus: MembershipStatus.ACTIVE,
  //     membershipPlan: MembershipPlan.GOLD,
  //   },
  // });

  // const regularUsers = await Promise.all([
  //   prisma.user.create({
  //     data: {
  //       name: 'Emily Johnson',
  //       email: 'emily.johnson@example.com',
  //       role: UserRole.USER,
  //       membershipStatus: MembershipStatus.ACTIVE,
  //       membershipPlan: MembershipPlan.SILVER,
  //     },
  //   }),
  //   prisma.user.create({
  //     data: {
  //       name: 'Michael Chen',
  //       email: 'michael.chen@example.com',
  //       role: UserRole.USER,
  //       membershipStatus: MembershipStatus.ACTIVE,
  //       membershipPlan: MembershipPlan.BRONZE,
  //     },
  //   }),
  //   prisma.user.create({
  //     data: {
  //       name: 'Sophia Rodriguez',
  //       email: 'sophia.rodriguez@example.com',
  //       role: UserRole.USER,
  //       membershipStatus: MembershipStatus.INACTIVE,
  //       membershipPlan: MembershipPlan.FREE,
  //     },
  //   }),
  //   prisma.user.create({
  //     data: {
  //       name: 'Daniel Kim',
  //       email: 'daniel.kim@example.com',
  //       role: UserRole.USER,
  //       membershipStatus: MembershipStatus.ACTIVE,
  //       membershipPlan: MembershipPlan.GOLD,
  //     },
  //   }),
  // ]);

  // const allUsers = [adminUser, ...regularUsers];

  // Create yoga videos
  // const yogaVideos = await Promise.all([
  //   prisma.yogaVideo.create({
  //     data: {
  //       title: 'Morning Sun Salutations',
  //       description: 'Start your day with energizing sun salutations',
  //       type: YogaType.BUILD,
  //       props: ['mat'],
  //       muxAssetId: 'Bm3yWIPKvBw4MrRkFShFaeI5WWDAwtaIEw2k91FxPMM',
  //       muxPlaybackId: '6CSCnxPakqazhXU6aDO02y02cvuqrcay02vQF1HoBaexns',
  //       thumbnailUrl: '/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png',
  //       duration: 1200, // 20 minutes
  //     },
  //   }),
  //   prisma.yogaVideo.create({
  //     data: {
  //       title: 'Gentle Bedtime Yoga',
  //       description: 'Relax and unwind with this calming bedtime routine',
  //       type: YogaType.MINDFULNESS,
  //       props: ['mat', 'bolster'],
  //       muxAssetId: 'Bm3yWIPKvBw4MrRkFShFaeI5WWDAwtaIEw2k91FxPMM',
  //       muxPlaybackId: '6CSCnxPakqazhXU6aDO02y02cvuqrcay02vQF1HoBaexns',
  //       thumbnailUrl: '/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png',
  //       duration: 900, // 15 minutes
  //     },
  //   }),
  //   prisma.yogaVideo.create({
  //     data: {
  //       title: 'Power Vinyasa Flow',
  //       description: 'Challenge yourself with this dynamic vinyasa sequence',
  //       type: YogaType.BUILD,
  //       props: ['mat', 'block'],
  //       muxAssetId: 'Bm3yWIPKvBw4MrRkFShFaeI5WWDAwtaIEw2k91FxPMM',
  //       muxPlaybackId: '6CSCnxPakqazhXU6aDO02y02cvuqrcay02vQF1HoBaexns',
  //       thumbnailUrl: '/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png',
  //       duration: 3600, // 60 minutes
  //     },
  //   }),
  //   prisma.yogaVideo.create({
  //     data: {
  //       title: 'Yin Yoga for Flexibility',
  //       description: 'Improve flexibility with long-held, passive poses',
  //       type: YogaType.EXPLORE,
  //       props: ['mat', 'strap', 'bolster'],
  //       muxAssetId: 'Bm3yWIPKvBw4MrRkFShFaeI5WWDAwtaIEw2k91FxPMM',
  //       muxPlaybackId: '6CSCnxPakqazhXU6aDO02y02cvuqrcay02vQF1HoBaexns',
  //       thumbnailUrl: '/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png',
  //       duration: 2700, // 45 minutes
  //     },
  //   }),
  //   prisma.yogaVideo.create({
  //     data: {
  //       title: 'Yoga for Back Pain Relief',
  //       description: 'Gentle stretches and poses to alleviate back pain',
  //       type: YogaType.MINDFULNESS,
  //       props: ['mat', 'block', 'strap'],
  //       muxAssetId: 'Bm3yWIPKvBw4MrRkFShFaeI5WWDAwtaIEw2k91FxPMM',
  //       muxPlaybackId: '6CSCnxPakqazhXU6aDO02y02cvuqrcay02vQF1HoBaexns',
  //       thumbnailUrl: '/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png',
  //       duration: 1800, // 30 minutes
  //     },
  //   }),
  //   prisma.yogaVideo.create({
  //     data: {
  //       title: 'Ashtanga Primary Series',
  //       description: 'Traditional Ashtanga yoga primary series practice',
  //       type: YogaType.BUILD,
  //       props: ['mat'],
  //       muxAssetId: 'Bm3yWIPKvBw4MrRkFShFaeI5WWDAwtaIEw2k91FxPMM',
  //       muxPlaybackId: '6CSCnxPakqazhXU6aDO02y02cvuqrcay02vQF1HoBaexns',
  //       thumbnailUrl: '/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png',
  //       duration: 5400, // 90 minutes
  //     },
  //   }),
  //   prisma.yogaVideo.create({
  //     data: {
  //       title: 'Restorative Yoga for Stress Relief',
  //       description: 'Deeply relaxing practice to reduce stress and anxiety',
  //       type: YogaType.MINDFULNESS,
  //       props: ['mat', 'bolster', 'blanket', 'block'],
  //       muxAssetId: 'Bm3yWIPKvBw4MrRkFShFaeI5WWDAwtaIEw2k91FxPMM',
  //       muxPlaybackId: '6CSCnxPakqazhXU6aDO02y02cvuqrcay02vQF1HoBaexns',
  //       thumbnailUrl: '/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png',
  //       duration: 3600, // 60 minutes
  //     },
  //   }),
  //   prisma.yogaVideo.create({
  //     data: {
  //       title: 'Yoga for Runners',
  //       description: 'Stretch and strengthen key muscles for runners',
  //       type: YogaType.EXPLORE,
  //       props: ['mat', 'strap'],
  //       muxAssetId: 'Bm3yWIPKvBw4MrRkFShFaeI5WWDAwtaIEw2k91FxPMM',
  //       muxPlaybackId: '6CSCnxPakqazhXU6aDO02y02cvuqrcay02vQF1HoBaexns',
  //       thumbnailUrl: '/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png',
  //       duration: 2400, // 40 minutes
  //     },
  //   }),
  //   prisma.yogaVideo.create({
  //     data: {
  //       title: 'Chair Yoga for Office Workers',
  //       description: 'Simple yoga exercises you can do at your desk',
  //       type: YogaType.MINDFULNESS,
  //       props: ['chair'],
  //       muxAssetId: 'Bm3yWIPKvBw4MrRkFShFaeI5WWDAwtaIEw2k91FxPMM',
  //       muxPlaybackId: '6CSCnxPakqazhXU6aDO02y02cvuqrcay02vQF1HoBaexns',
  //       thumbnailUrl: '/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png',
  //       duration: 900, // 15 minutes
  //     },
  //   }),
  //   prisma.yogaVideo.create({
  //     data: {
  //       title: 'Kundalini Yoga for Beginners',
  //       description: 'Introduction to Kundalini yoga practice',
  //       type: YogaType.EXPLORE,
  //       props: ['mat', 'blanket'],
  //       muxAssetId: 'Bm3yWIPKvBw4MrRkFShFaeI5WWDAwtaIEw2k91FxPMM',
  //       muxPlaybackId: '6CSCnxPakqazhXU6aDO02y02cvuqrcay02vQF1HoBaexns',
  //       thumbnailUrl: '/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png',
  //       duration: 3600, // 60 minutes
  //     },
  //   }),
  //   prisma.yogaVideo.create({
  //     data: {
  //       title: 'Prenatal Yoga: Second Trimester',
  //       description: 'Safe and nurturing yoga practice for expecting mothers',
  //       type: YogaType.MINDFULNESS,
  //       props: ['mat', 'bolster', 'block'],
  //       muxAssetId: 'Bm3yWIPKvBw4MrRkFShFaeI5WWDAwtaIEw2k91FxPMM',
  //       muxPlaybackId: '6CSCnxPakqazhXU6aDO02y02cvuqrcay02vQF1HoBaexns',
  //       thumbnailUrl: '/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png',
  //       duration: 2700, // 45 minutes
  //     },
  //   }),
  //   prisma.yogaVideo.create({
  //     data: {
  //       title: 'Yoga for Better Sleep',
  //       description: 'Calming sequences to prepare your body for rest',
  //       type: YogaType.MINDFULNESS,
  //       props: ['mat', 'bolster'],
  //       muxAssetId: 'Bm3yWIPKvBw4MrRkFShFaeI5WWDAwtaIEw2k91FxPMM',
  //       muxPlaybackId: '6CSCnxPakqazhXU6aDO02y02cvuqrcay02vQF1HoBaexns',
  //       thumbnailUrl: '/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png',
  //       duration: 1800, // 30 minutes
  //     },
  //   }),
  //   prisma.yogaVideo.create({
  //     data: {
  //       title: 'Core Strength Vinyasa',
  //       description: 'Build core strength with this challenging vinyasa flow',
  //       type: YogaType.BUILD,
  //       props: ['mat'],
  //       muxAssetId: 'Bm3yWIPKvBw4MrRkFShFaeI5WWDAwtaIEw2k91FxPMM',
  //       muxPlaybackId: '6CSCnxPakqazhXU6aDO02y02cvuqrcay02vQF1HoBaexns',
  //       thumbnailUrl: '/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png',
  //       duration: 3600, // 60 minutes
  //     },
  //   }),
  //   prisma.yogaVideo.create({
  //     data: {
  //       title: 'Yoga for Hikers and Climbers',
  //       description: 'Improve flexibility and balance for outdoor enthusiasts',
  //       type: YogaType.EXPLORE,
  //       props: ['mat', 'block'],
  //       muxAssetId: 'Bm3yWIPKvBw4MrRkFShFaeI5WWDAwtaIEw2k91FxPMM',
  //       muxPlaybackId: '6CSCnxPakqazhXU6aDO02y02cvuqrcay02vQF1HoBaexns',
  //       thumbnailUrl: '/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png',
  //       duration: 2700, // 45 minutes
  //     },
  //   }),
  //   prisma.yogaVideo.create({
  //     data: {
  //       title: 'Gentle Yoga for Seniors',
  //       description: 'Safe, low-impact yoga practice for older adults',
  //       type: YogaType.MINDFULNESS,
  //       props: ['chair', 'strap'],
  //       muxAssetId: 'Bm3yWIPKvBw4MrRkFShFaeI5WWDAwtaIEw2k91FxPMM',
  //       muxPlaybackId: '6CSCnxPakqazhXU6aDO02y02cvuqrcay02vQF1HoBaexns',
  //       thumbnailUrl: '/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png',
  //       duration: 1800, // 30 minutes
  //     },
  //   }),
  // ]);

  // Create exercises
  const exercises = [];
  for (const exercise of EXERCISES) {
    const result = await prisma.exercise.create({
      data: exercise,
    });
    exercises.push(result);
  }

  // Create workouts
  // const workouts = await Promise.all([
  //   prisma.workout.create({
  //     data: {
  //       name: 'Full Body Strength',
  //       description: 'A comprehensive full-body workout to build overall strength',
  //       totalLength: 3600, // 60 minutes
  //       equipment: ['Barbell', 'Dumbbells', 'Bench'],
  //       muscleGroups: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms'],
  //       sets: {
  //         create: [
  //           {
  //             type: SetType.SUPERSET,
  //             rounds: 3,
  //             rest: 60,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[0].id } },
  //                   targetReps: 12,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[1].id } },
  //                   targetReps: 15,
  //                   order: 2,
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             type: SetType.MULTISET,
  //             rounds: 4,
  //             rest: 90,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[2].id } },
  //                   targetReps: 8,
  //                   order: 1,
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             type: SetType.TRISET,
  //             rounds: 3,
  //             rest: 45,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[3].id } },
  //                   targetReps: 10,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[4].id } },
  //                   targetReps: 8,
  //                   order: 2,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[5].id } },
  //                   targetReps: 12,
  //                   order: 3,
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     include: {
  //       sets: {
  //         include: {
  //           exercises: true,
  //         },
  //       },
  //     },
  //   }),
  //   prisma.workout.create({
  //     data: {
  //       name: 'HIIT Cardio Blast',
  //       description: 'High-intensity interval training to boost cardiovascular fitness',
  //       totalLength: 1800, // 30 minutes
  //       equipment: ['None'],
  //       muscleGroups: ['Full Body'],
  //       sets: {
  //         create: [
  //           {
  //             type: SetType.CIRCUIT,
  //             rounds: 4,
  //             rest: 30,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[9].id } },
  //                   targetReps: 15,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[6].id } },
  //                   targetReps: 30,
  //                   order: 2,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[13].id } },
  //                   targetReps: 30,
  //                   order: 3,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[14].id } },
  //                   targetReps: 50,
  //                   order: 4,
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     include: {
  //       sets: {
  //         include: {
  //           exercises: true,
  //         },
  //       },
  //     },
  //   }),
  //   prisma.workout.create({
  //     data: {
  //       name: 'Upper Body Power',
  //       description: 'Focus on building upper body strength and muscle',
  //       totalLength: 2700, // 45 minutes
  //       equipment: ['Dumbbells', 'Barbell', 'Pull-up Bar'],
  //       muscleGroups: ['Chest', 'Back', 'Shoulders', 'Arms'],
  //       sets: {
  //         create: [
  //           {
  //             type: SetType.SUPERSET,
  //             rounds: 4,
  //             rest: 60,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[3].id } },
  //                   targetReps: 8,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[4].id } },
  //                   targetReps: 10,
  //                   order: 2,
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             type: SetType.TRISET,
  //             rounds: 3,
  //             rest: 45,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[7].id } },
  //                   targetReps: 12,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[11].id } },
  //                   targetReps: 15,
  //                   order: 2,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[0].id } },
  //                   targetReps: 20,
  //                   order: 3,
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     include: {
  //       sets: {
  //         include: {
  //           exercises: true,
  //         },
  //       },
  //     },
  //   }),
  //   prisma.workout.create({
  //     data: {
  //       name: 'Core Crusher',
  //       description: 'Intense abdominal and core strengthening workout',
  //       totalLength: 1800, // 30 minutes
  //       equipment: ['None'],
  //       muscleGroups: ['Core', 'Abs', 'Obliques'],
  //       sets: {
  //         create: [
  //           {
  //             type: SetType.CIRCUIT,
  //             rounds: 3,
  //             rest: 30,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[5].id } },
  //                   targetReps: 60,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[8].id } },
  //                   targetReps: 30,
  //                   order: 2,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[10].id } },
  //                   targetReps: 40,
  //                   order: 3,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[13].id } },
  //                   targetReps: 30,
  //                   order: 4,
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     include: {
  //       sets: {
  //         include: {
  //           exercises: true,
  //         },
  //       },
  //     },
  //   }),
  //   prisma.workout.create({
  //     data: {
  //       name: 'Leg Day Challenge',
  //       description: 'Intense lower body workout to build strength and muscle',
  //       totalLength: 3600, // 60 minutes
  //       equipment: ['Barbell', 'Dumbbells'],
  //       muscleGroups: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
  //       sets: {
  //         create: [
  //           {
  //             type: SetType.MULTISET,
  //             rounds: 5,
  //             rest: 120,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[1].id } },
  //                   targetReps: 10,
  //                   order: 1,
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             type: SetType.SUPERSET,
  //             rounds: 4,
  //             rest: 60,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[2].id } },
  //                   targetReps: 12,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[6].id } },
  //                   targetReps: 15,
  //                   order: 2,
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             type: SetType.TRISET,
  //             rounds: 3,
  //             rest: 45,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[14].id } },
  //                   targetReps: 20,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[9].id } },
  //                   targetReps: 15,
  //                   order: 2,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[13].id } },
  //                   targetReps: 30,
  //                   order: 3,
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     include: {
  //       sets: {
  //         include: {
  //           exercises: true,
  //         },
  //       },
  //     },
  //   }),
  //   prisma.workout.create({
  //     data: {
  //       name: 'Bodyweight Basics',
  //       description: 'Full-body workout using only your body weight',
  //       totalLength: 2400, // 40 minutes
  //       equipment: ['None'],
  //       muscleGroups: ['Full Body'],
  //       sets: {
  //         create: [
  //           {
  //             type: SetType.CIRCUIT,
  //             rounds: 4,
  //             rest: 30,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[0].id } },
  //                   targetReps: 15,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[1].id } },
  //                   targetReps: 20,
  //                   order: 2,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[4].id } },
  //                   targetReps: 8,
  //                   order: 3,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[6].id } },
  //                   targetReps: 20,
  //                   order: 4,
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     include: {
  //       sets: {
  //         include: {
  //           exercises: true,
  //         },
  //       },
  //     },
  //   }),
  //   prisma.workout.create({
  //     data: {
  //       name: 'Kettlebell Conditioning',
  //       description: 'Full-body workout focusing on kettlebell exercises',
  //       totalLength: 2700, // 45 minutes
  //       equipment: ['Kettlebell'],
  //       muscleGroups: ['Full Body'],
  //       sets: {
  //         create: [
  //           {
  //             type: SetType.SUPERSET,
  //             rounds: 4,
  //             rest: 60,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[14].id } },
  //                   targetReps: 15,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[1].id } },
  //                   targetReps: 12,
  //                   order: 2,
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             type: SetType.TRISET,
  //             rounds: 3,
  //             rest: 45,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[7].id } },
  //                   targetReps: 10,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[8].id } },
  //                   targetReps: 20,
  //                   order: 2,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[13].id } },
  //                   targetReps: 30,
  //                   order: 3,
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     include: {
  //       sets: {
  //         include: {
  //           exercises: true,
  //         },
  //       },
  //     },
  //   }),
  //   prisma.workout.create({
  //     data: {
  //       name: 'Endurance Builder',
  //       description: 'High-rep, low-weight workout to improve muscular endurance',
  //       totalLength: 3600, // 60 minutes
  //       equipment: ['Dumbbells', 'Resistance Bands'],
  //       muscleGroups: ['Full Body'],
  //       sets: {
  //         create: [
  //           {
  //             type: SetType.CIRCUIT,
  //             rounds: 3,
  //             rest: 30,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[0].id } },
  //                   targetReps: 25,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[1].id } },
  //                   targetReps: 30,
  //                   order: 2,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[7].id } },
  //                   targetReps: 20,
  //                   order: 3,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[10].id } },
  //                   targetReps: 50,
  //                   order: 4,
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             type: SetType.CIRCUIT,
  //             rounds: 3,
  //             rest: 30,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[6].id } },
  //                   targetReps: 30,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[8].id } },
  //                   targetReps: 40,
  //                   order: 2,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[13].id } },
  //                   targetReps: 45,
  //                   order: 3,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[14].id } },
  //                   targetReps: 100,
  //                   order: 4,
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     include: {
  //       sets: {
  //         include: {
  //           exercises: true,
  //         },
  //       },
  //     },
  //   }),
  //   prisma.workout.create({
  //     data: {
  //       name: 'Functional Fitness',
  //       description: 'Workout focusing on movements that mimic everyday activities',
  //       totalLength: 2700, // 45 minutes
  //       equipment: ['Kettlebell', 'Medicine Ball'],
  //       muscleGroups: ['Full Body'],
  //       sets: {
  //         create: [
  //           {
  //             type: SetType.CIRCUIT,
  //             rounds: 4,
  //             rest: 30,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[14].id } },
  //                   targetReps: 15,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[2].id } },
  //                   targetReps: 12,
  //                   order: 2,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[6].id } },
  //                   targetReps: 20,
  //                   order: 3,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[9].id } },
  //                   targetReps: 15,
  //                   order: 4,
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     include: {
  //       sets: {
  //         include: {
  //           exercises: true,
  //         },
  //       },
  //     },
  //   }),
  //   prisma.workout.create({
  //     data: {
  //       name: 'Power and Explosiveness',
  //       description: 'Workout designed to improve power output and explosive movements',
  //       totalLength: 2400, // 40 minutes
  //       equipment: ['Barbell', 'Plyo Box'],
  //       muscleGroups: ['Full Body'],
  //       sets: {
  //         create: [
  //           {
  //             type: SetType.SUPERSET,
  //             rounds: 5,
  //             rest: 90,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[2].id } },
  //                   targetReps: 5,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[9].id } },
  //                   targetReps: 10,
  //                   order: 2,
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             type: SetType.TRISET,
  //             rounds: 4,
  //             rest: 60,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[7].id } },
  //                   targetReps: 8,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[14].id } },
  //                   targetReps: 15,
  //                   order: 2,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[13].id } },
  //                   targetReps: 20,
  //                   order: 3,
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     include: {
  //       sets: {
  //         include: {
  //           exercises: true,
  //         },
  //       },
  //     },
  //   }),
  //   prisma.workout.create({
  //     data: {
  //       name: 'Active Recovery',
  //       description: 'Low-intensity workout to promote recovery and maintain activity',
  //       totalLength: 1800, // 30 minutes
  //       equipment: ['Resistance Bands'],
  //       muscleGroups: ['Full Body'],
  //       sets: {
  //         create: [
  //           {
  //             type: SetType.CIRCUIT,
  //             rounds: 2,
  //             rest: 30,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[5].id } },
  //                   targetReps: 30,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[6].id } },
  //                   targetReps: 15,
  //                   order: 2,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[8].id } },
  //                   targetReps: 20,
  //                   order: 3,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[14].id } },
  //                   targetReps: 50,
  //                   order: 4,
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     include: {
  //       sets: {
  //         include: {
  //           exercises: true,
  //         },
  //       },
  //     },
  //   }),
  //   prisma.workout.create({
  //     data: {
  //       name: 'Strength and Stability',
  //       description: 'Workout focusing on building strength while improving balance and stability',
  //       totalLength: 3000, // 50 minutes
  //       equipment: ['Dumbbells', 'Stability Ball'],
  //       muscleGroups: ['Full Body'],
  //       sets: {
  //         create: [
  //           {
  //             type: SetType.SUPERSET,
  //             rounds: 4,
  //             rest: 60,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[1].id } },
  //                   targetReps: 12,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[5].id } },
  //                   targetReps: 45,
  //                   order: 2,
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             type: SetType.TRISET,
  //             rounds: 3,
  //             rest: 45,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[7].id } },
  //                   targetReps: 10,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[6].id } },
  //                   targetReps: 15,
  //                   order: 2,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[8].id } },
  //                   targetReps: 20,
  //                   order: 3,
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     include: {
  //       sets: {
  //         include: {
  //           exercises: true,
  //         },
  //       },
  //     },
  //   }),
  //   prisma.workout.create({
  //     data: {
  //       name: 'Metabolic Conditioning',
  //       description: 'High-intensity workout to boost metabolism and burn calories',
  //       totalLength: 2400, // 40 minutes
  //       equipment: ['Jump Rope', 'Kettlebell'],
  //       muscleGroups: ['Full Body'],
  //       sets: {
  //         create: [
  //           {
  //             type: SetType.CIRCUIT,
  //             rounds: 5,
  //             rest: 30,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[14].id } },
  //                   targetReps: 100,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[9].id } },
  //                   targetReps: 15,
  //                   order: 2,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[13].id } },
  //                   targetReps: 30,
  //                   order: 3,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[14].id } },
  //                   targetReps: 20,
  //                   order: 4,
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     include: {
  //       sets: {
  //         include: {
  //           exercises: true,
  //         },
  //       },
  //     },
  //   }),
  //   prisma.workout.create({
  //     data: {
  //       name: 'Mobility and Flexibility',
  //       description: 'Workout designed to improve range of motion and flexibility',
  //       totalLength: 2700, // 45 minutes
  //       equipment: ['Yoga Mat', 'Foam Roller'],
  //       muscleGroups: ['Full Body'],
  //       sets: {
  //         create: [
  //           {
  //             type: SetType.CIRCUIT,
  //             rounds: 3,
  //             rest: 30,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[6].id } },
  //                   targetReps: 15,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[5].id } },
  //                   targetReps: 60,
  //                   order: 2,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[8].id } },
  //                   targetReps: 20,
  //                   order: 3,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[10].id } },
  //                   targetReps: 30,
  //                   order: 4,
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     include: {
  //       sets: {
  //         include: {
  //           exercises: true,
  //         },
  //       },
  //     },
  //   }),
  //   prisma.workout.create({
  //     data: {
  //       name: 'Sports Performance',
  //       description: 'Workout targeting key areas for overall athletic performance',
  //       totalLength: 3300, // 55 minutes
  //       equipment: ['Agility Ladder', 'Medicine Ball', 'Resistance Bands'],
  //       muscleGroups: ['Full Body'],
  //       sets: {
  //         create: [
  //           {
  //             type: SetType.CIRCUIT,
  //             rounds: 4,
  //             rest: 45,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[9].id } },
  //                   targetReps: 15,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[13].id } },
  //                   targetReps: 30,
  //                   order: 2,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[4].id } },
  //                   targetReps: 8,
  //                   order: 3,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[14].id } },
  //                   targetReps: 20,
  //                   order: 4,
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             type: SetType.SUPERSET,
  //             rounds: 3,
  //             rest: 60,
  //             exercises: {
  //               create: [
  //                 {
  //                   exercise: { connect: { id: exercises[2].id } },
  //                   targetReps: 10,
  //                   order: 1,
  //                 },
  //                 {
  //                   exercise: { connect: { id: exercises[7].id } },
  //                   targetReps: 12,
  //                   order: 2,
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     include: {
  //       sets: {
  //         include: {
  //           exercises: true,
  //         },
  //       },
  //     },
  //   }),
  // ]);

  // // Create workout histories
  // const workoutHistories = await Promise.all(
  //   Array.from({ length: 10 }).map(async (_, index) => {
  //     const user = allUsers[index % allUsers.length];
  //     const workout = workouts[index % workouts.length];
  //     const startDate = new Date();
  //     startDate.setDate(startDate.getDate() - index * 2);
  //     const endDate = new Date(startDate.getTime() + workout.totalLength * 1000);
  //     const id = faker.string.uuid();

  //     return prisma.workoutActivity.create({
  //       data: {
  //         userId: user.id,
  //         workoutId: workout.id,
  //         startedAt: startDate,
  //         endedAt: endDate,
  //         id,
  //         sets: {
  //           create: workout.sets.map((set, setIndex) => ({
  //             setNumber: setIndex + 1,
  //             roundNumber: 1,
  //             exercises: {
  //               create: set.exercises.flatMap((setExercise) => {
  //                 const exercise = exercises.find((e) => e.id === setExercise.exerciseId);
  //                 if (!exercise) throw new Error(`Exercise not found: ${setExercise.exerciseId}`);

  //                 return Array.from({ length: set.rounds }).map((_, roundIndex) => ({
  //                   exerciseId: setExercise.exerciseId,
  //                   workoutActivityId: id,
  //                   weight: Math.floor(Math.random() * 20) + 10,

  //                   reps: Math.floor(Math.random() * 5) + setExercise.targetReps - 2,
  //                   time: exercise.mode === 'TIME' ? Math.floor(Math.random() * 30) + 30 : null,
  //                   distance:
  //                     exercise.mode === 'DISTANCE' ? Math.floor(Math.random() * 1000) + 500 : null,
  //                   roundNumber: roundIndex + 1,
  //                 }));
  //               }),
  //             },
  //           })),
  //         },
  //       },
  //     });
  //   }),
  // );

  // // Create yoga histories
  // const yogaHistories = await Promise.all(
  //   Array.from({ length: 10 }).map((_, index) => {
  //     const user = allUsers[index % allUsers.length];
  //     const video = yogaVideos[index % yogaVideos.length];
  //     const watchedAt = new Date();
  //     watchedAt.setDate(watchedAt.getDate() - index);

  //     return prisma.yogaVideoActivity.create({
  //       data: {
  //         userId: user.id,
  //         videoId: video.id,
  //         watchedAt: watchedAt,
  //       },
  //     });
  //   }),
  // );

  // // Create user exercise weights
  // const userExerciseWeights = await Promise.all(
  //   allUsers.flatMap((user) =>
  //     workouts.flatMap((workout) =>
  //       exercises.map((exercise) =>
  //         prisma.userExerciseWeight.create({
  //           data: {
  //             userId: user.id,
  //             workoutId: workout.id,
  //             exerciseId: exercise.id,
  //             weight: Math.floor(Math.random() * 20) + 10, // Random weight between 10 and 30
  //           },
  //         }),
  //       ),
  //     ),
  //   ),
  // );

  // const programmes = await Promise.all([
  //   prisma.programme.create({
  //     data: {
  //       title: '30-Day Fitness Kickstart',
  //       description: 'A comprehensive 30-day programme to jumpstart your fitness journey.',
  //       thumbnail: 'https://loremflickr.com/g/300/300/fitness',
  //       sessionsPerWeek: 5,
  //       intention: 'General Fitness',
  //       weeks: 2,
  //       activities: {
  //         create: [
  //           {
  //             week: 1,
  //             day: 1,
  //             activityType: 'WORKOUT',
  //             workoutId: workouts[0].id,
  //           },
  //           {
  //             week: 1,
  //             day: 2,
  //             activityType: 'YOGA',
  //             yogaVideoId: yogaVideos[0].id,
  //           },
  //           {
  //             week: 1,
  //             day: 3,
  //             activityType: 'WORKOUT',
  //             workoutId: workouts[1].id,
  //           },
  //           {
  //             week: 1,
  //             day: 4,
  //             activityType: 'YOGA',
  //             yogaVideoId: yogaVideos[1].id,
  //           },
  //           {
  //             week: 1,
  //             day: 5,
  //             activityType: 'WORKOUT',
  //             workoutId: workouts[2].id,
  //           },
  //           {
  //             week: 2,
  //             day: 1,
  //             activityType: 'WORKOUT',
  //             workoutId: workouts[0].id,
  //           },
  //           {
  //             week: 2,
  //             day: 2,
  //             activityType: 'YOGA',
  //             yogaVideoId: yogaVideos[0].id,
  //           },
  //           {
  //             week: 2,
  //             day: 3,
  //             activityType: 'WORKOUT',
  //             workoutId: workouts[1].id,
  //           },
  //           {
  //             week: 2,
  //             day: 4,
  //             activityType: 'YOGA',
  //             yogaVideoId: yogaVideos[1].id,
  //           },
  //           {
  //             week: 2,
  //             day: 5,
  //             activityType: 'WORKOUT',
  //             workoutId: workouts[2].id,
  //           },
  //         ],
  //       },
  //     },
  //   }),
  //   prisma.programme.create({
  //     data: {
  //       title: 'Mobility Mastery',
  //       description: 'Improve your flexibility and mobility with this 8-week programme.',
  //       thumbnail: 'https://loremflickr.com/g/300/300/fitness',
  //       sessionsPerWeek: 3,
  //       intention: 'Mobility',
  //       weeks: 1,
  //       activities: {
  //         create: [
  //           {
  //             week: 1,
  //             day: 1,
  //             activityType: 'YOGA',
  //             yogaVideoId: yogaVideos[2].id,
  //           },
  //           {
  //             week: 1,
  //             day: 2,
  //             activityType: 'WORKOUT',
  //             workoutId: workouts[3].id,
  //           },
  //           {
  //             week: 1,
  //             day: 3,
  //             activityType: 'YOGA',
  //             yogaVideoId: yogaVideos[3].id,
  //           },
  //         ],
  //       },
  //     },
  //   }),
  // ]);

  // console.log(`Seeding completed:
  //   - ${allUsers.length} users created (1 admin, ${regularUsers.length} regular)
  //   - ${yogaVideos.length} yoga videos created
  //   - ${exercises.length} exercises created
  //   - ${workouts.length} workouts created
  //   - ${yogaHistories.length} yoga histories created
  //   - ${workoutHistories.length} workout histories created
  //   - ${userExerciseWeights.length} user exercise weights created
  //   - ${programmes.length} programmes created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
