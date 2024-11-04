"use client";

import { Plus, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GoalCard } from "./goal-card";
import { AddGoalForm } from "./add-goal-form";
import { Goal } from "@prisma/client";

import Link from "next/link";

type GoalsSectionProps = {
  goals: Goal[];
};

export function GoalsSection({ goals }: GoalsSectionProps) {
  const activeGoals = goals.filter((goal) => goal.isActive);

  return (
    <Card className="bg-card/50 backdrop-blur hover:bg-card/60 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl">Goals</CardTitle>
          <CardDescription>Track your fitness objectives</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add Goal</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Goal</DialogTitle>
                <DialogDescription>
                  Set a new goal to track your progress
                </DialogDescription>
              </DialogHeader>
              <AddGoalForm
                maxActiveGoals={5}
                currentActiveGoals={activeGoals.length}
              />
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/goals">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">View all goals</span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activeGoals.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
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
