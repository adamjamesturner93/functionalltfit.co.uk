'use client';

import { useCallback, useEffect, useState } from 'react';
import { Goal, GoalType } from '@prisma/client';
import { Trophy, X } from 'lucide-react';

import { getGoalProgress, markGoalComplete, markGoalInactive } from '@/app/actions/goals';
import { Button } from '@/components/ui/button';
import { Confetti } from '@/components/ui/confetti';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

type GoalCardProps = Goal & {
  showActions?: boolean;
};

export function GoalCard({
  id,
  type,
  target,
  current,
  period,
  title,
  showActions = true,
}: GoalCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [goalData, setGoalData] = useState({
    current,
    progress: (current / target) * 100,
  });
  const { toast } = useToast();

  const isCompleted = goalData.current >= target;

  const refreshGoalProgress = useCallback(async () => {
    try {
      const result = await getGoalProgress(id);
      if (result.error) throw new Error(result.error);
      if (result.goal) {
        setGoalData({
          current: result.goal.current,
          progress: result.goal.progress,
        });
      }
    } catch (error) {
      console.error('Failed to refresh goal progress:', error);
    }
  }, [id]);

  useEffect(() => {
    refreshGoalProgress();
    const interval = setInterval(refreshGoalProgress, 60000);
    return () => clearInterval(interval);
  }, [refreshGoalProgress]);

  const formatValue = (value: number) => {
    if (type === GoalType.WEIGHT) {
      return `${value.toFixed(1)} kg`;
    }
    return value.toString();
  };

  const handleMarkComplete = async () => {
    setIsLoading(true);
    try {
      const result = await markGoalComplete(id);
      if (result.error) throw new Error(result.error);
      if (result.goal) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        toast({
          title: 'Goal completed',
          description: 'Congratulations on achieving your goal!',
        });
        await refreshGoalProgress();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to mark goal as complete.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkInactive = async () => {
    setIsLoading(true);
    try {
      const result = await markGoalInactive(id);
      if (result.error) throw new Error(result.error);
      if (result.goal) {
        toast({
          title: 'Goal marked as inactive',
          description: 'Your goal has been marked as inactive.',
        });
        await refreshGoalProgress();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to mark goal as inactive.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative rounded-lg p-4 ${
        isCompleted ? 'bg-primary/10 backdrop-blur-sm' : 'bg-card'
      }`}
    >
      {showConfetti && <Confetti />}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{title || type}</h3>
          {isCompleted && <Trophy className="size-4 text-primary" />}
        </div>
        {showActions && !isCompleted && (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={handleMarkComplete} disabled={isLoading}>
              Complete
            </Button>
            <Button size="icon" variant="ghost" onClick={handleMarkInactive} disabled={isLoading}>
              <X className="size-4" />
              <span className="sr-only">Mark as inactive</span>
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress:</span>
          <span>
            {formatValue(goalData.current)} / {formatValue(target)}
            {period && ` per ${period.toLowerCase()}`}
          </span>
        </div>
        <Progress value={goalData.progress} className="h-2" />
      </div>
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-primary/20 backdrop-blur-sm">
          <div className="text-center">
            <h3 className="mb-1 text-2xl font-bold">Goal Achieved!</h3>
            <p className="text-sm text-muted-foreground">Congratulations on reaching your goal!</p>
          </div>
        </div>
      )}
    </div>
  );
}
