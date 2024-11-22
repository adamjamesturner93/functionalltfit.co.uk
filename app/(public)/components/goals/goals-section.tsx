'use client';

import { Goal } from '@prisma/client';
import { ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { AddGoalForm } from './add-goal-form';
import { GoalCard } from './goal-card';

type GoalsSectionProps = {
  goals: Goal[];
};

export function GoalsSection({ goals }: GoalsSectionProps) {
  const activeGoals = goals.filter((goal) => goal.isActive);

  return (
    <Card className="bg-card/50 backdrop-blur transition-colors hover:bg-card/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl">Goals</CardTitle>
          <CardDescription>Track your fitness objectives</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="size-4" />
                <span className="sr-only">Add Goal</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Goal</DialogTitle>
                <DialogDescription>Set a new goal to track your progress</DialogDescription>
              </DialogHeader>
              <AddGoalForm maxActiveGoals={5} currentActiveGoals={activeGoals.length} />
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/goals">
              <ChevronRight className="size-4" />
              <span className="sr-only">View all goals</span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activeGoals.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">
              No goals found. Add a goal to start tracking your progress!
            </p>
          ) : (
            activeGoals.map((goal) => (
              <GoalCard key={goal.id} {...goal} showActions={goal.isActive} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
