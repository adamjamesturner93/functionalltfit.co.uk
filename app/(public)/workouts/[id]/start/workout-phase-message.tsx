import { Dumbbell, Flame, Snowflake, Trophy } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

interface WorkoutPhaseMessageProps {
  currentPhase: 'warmup' | 'main' | 'cooldown' | 'complete';
  isLastExercise: boolean;
}

export function WorkoutPhaseMessage({ currentPhase, isLastExercise }: WorkoutPhaseMessageProps) {
  let message: string;
  let icon: JSX.Element;

  switch (currentPhase) {
    case 'warmup':
      message = isLastExercise
        ? 'Great job warming up! Get ready for the main workout.'
        : "Let's warm up those muscles!";
      icon = <Flame className="size-6 text-orange-500" />;
      break;
    case 'main':
      message = "You're crushing it! Keep pushing through the main workout.";
      icon = <Dumbbell className="size-6 text-blue-500" />;
      break;
    case 'cooldown':
      message = isLastExercise
        ? 'Almost done! Finish strong with this last cooldown exercise.'
        : "Great work! Let's cool down and stretch those muscles.";
      icon = <Snowflake className="size-6 text-cyan-500" />;
      break;
    case 'complete':
      message = 'Great work!';
      icon = <Trophy className="size-6 text-green-500" />;
      break;
  }

  return (
    <Card className="mb-4 bg-slate-800">
      <CardContent className="flex items-center p-4">
        {icon}
        <p className="ml-3 text-lg font-medium">{message}</p>
      </CardContent>
    </Card>
  );
}
