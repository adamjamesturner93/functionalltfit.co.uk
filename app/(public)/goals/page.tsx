import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAllGoals } from '@/app/actions/goals';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddGoalForm } from '../components/goals/add-goal-form';
import { GoalCard } from '../components/goals/goal-card';

export default async function GoalsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const goals = await getAllGoals(session.user.id);
  const activeGoals = goals.filter((goal) => goal.isActive);
  const completedGoals = goals.filter((goal) => !goal.isActive);

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold">Goals</h1>
          <p className="text-muted-foreground">Track and manage your fitness goals</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
              <DialogDescription>
                Set a new goal to track your progress. You can have up to 5 active goals at a time.
              </DialogDescription>
            </DialogHeader>
            <AddGoalForm maxActiveGoals={5} currentActiveGoals={activeGoals.length} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Goals ({activeGoals.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed Goals ({completedGoals.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          {activeGoals.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="space-y-2 text-center">
                  <p className="text-muted-foreground">No active goals</p>
                  <p className="text-sm text-muted-foreground">
                    Set a goal to start tracking your progress
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeGoals.map((goal) => (
                <GoalCard key={goal.id} {...goal} showActions />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          {completedGoals.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="space-y-2 text-center">
                  <p className="text-muted-foreground">No completed goals yet</p>
                  <p className="text-sm text-muted-foreground">
                    Your completed goals will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedGoals.map((goal) => (
                <GoalCard key={goal.id} {...goal} showActions={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
