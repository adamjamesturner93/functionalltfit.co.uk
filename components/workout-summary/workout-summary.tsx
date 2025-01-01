'use client';

import { useState } from 'react';
import { Unit } from '@prisma/client';
import { Clock, Target, TrendingUp, Trophy, Weight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { updateUserExerciseWeight } from '@/app/actions/workouts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { formatDuration, formatPerformance } from '@/lib/utils';

import { ExerciseCard } from './exercise-card';
import { StatCard } from './stat-card';

interface WorkoutSummaryProps {
  summary: any; // Replace with proper type
  workoutActivityId: string;
  userId: string;
  userPreferences: {
    weightUnit: Unit;
    lengthUnit: Unit;
  };
}

export function WorkoutSummary({
  summary,
  workoutActivityId,
  userId,
  userPreferences,
}: WorkoutSummaryProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [increasedWeights, setIncreasedWeights] = useState<Record<string, boolean>>({});

  const readyToProgressCount = summary.exercises.filter(
    (ex: any) => ex.targetReached && ex.mode === 'REPS',
  ).length;

  const personalBestsCount = summary.exercises.filter(
    (ex: any) =>
      ex.improvement.reps > 0 ||
      ex.improvement.weight > 0 ||
      ex.improvement.time > 0 ||
      ex.improvement.distance > 0,
  ).length;

  const handleIncreaseWeight = async (exerciseId: string, currentWeight: number) => {
    try {
      const newWeight = Math.ceil((currentWeight * 1.05) / 2.5) * 2.5;
      await updateUserExerciseWeight(workoutActivityId, exerciseId, newWeight, userId);
      setIncreasedWeights((prev) => ({ ...prev, [exerciseId]: true }));
      toast({
        title: 'Weight Increased',
        description: `The weight for this exercise has been increased to ${formatPerformance(
          newWeight,
          'weight',
          userPreferences.weightUnit === 'IMPERIAL' ? 'lbs' : 'kg',
        )}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update weight. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-50">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="size-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">Workout Complete!</h1>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon={Clock} label="Duration" value={formatDuration(summary.totalDuration)} />
          <StatCard
            icon={Weight}
            label="Weight Lifted"
            value={formatPerformance(
              summary.totalWeightLifted,
              'weight',
              userPreferences.weightUnit === 'IMPERIAL' ? 'lbs' : 'kg',
            )}
          />
          <StatCard icon={Target} label="Ready to Progress" value={readyToProgressCount} />
          <StatCard icon={TrendingUp} label="Personal Bests" value={personalBestsCount} />
        </div>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-slate-950">
                <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-slate-800">
                  Exercise Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Achievements</h3>
                  <div className="space-y-3">
                    {summary.exercises
                      .filter((ex: any) => ex.targetReached && ex.mode === 'REPS')
                      .map((exercise: any) => (
                        <ExerciseCard
                          key={exercise.id}
                          exercise={exercise}
                          userPreferences={userPreferences}
                          onIncreaseWeight={handleIncreaseWeight}
                          isWeightIncreased={increasedWeights[exercise.exerciseId]}
                        />
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                {summary.exercises.map((exercise: any) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    userPreferences={userPreferences}
                    onIncreaseWeight={handleIncreaseWeight}
                    isWeightIncreased={increasedWeights[exercise.exerciseId]}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            onClick={() => router.push('/workouts')}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Workouts
          </Button>
        </div>
      </div>
    </div>
  );
}
