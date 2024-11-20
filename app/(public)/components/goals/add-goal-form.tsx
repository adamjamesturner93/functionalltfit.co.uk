'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { GoalType, GoalPeriod } from '@prisma/client';
import { addGoal } from '@/app/actions/goals';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

const goalSchema = z.object({
  type: z.enum([
    GoalType.WEIGHT,
    GoalType.YOGA_SESSIONS,
    GoalType.WORKOUT_SESSIONS,
    GoalType.TOTAL_SESSIONS,
    GoalType.CUSTOM,
    GoalType.EXERCISE_WEIGHT,
    GoalType.EXERCISE_REPS,
    GoalType.EXERCISE_DISTANCE,
  ]),
  target: z.string().transform(Number),
  period: z.enum([GoalPeriod.WEEK, GoalPeriod.MONTH]).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  exerciseId: z.string().optional(),
  endDate: z.date().optional(),
});

type AddGoalFormProps = {
  maxActiveGoals: number;
  currentActiveGoals: number;
};

export function AddGoalForm({ maxActiveGoals, currentActiveGoals }: AddGoalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      type: GoalType.WEIGHT,
      target: 0,
      period: GoalPeriod.WEEK,
    },
  });

  const goalType = form.watch('type');

  async function onSubmit(values: z.infer<typeof goalSchema>) {
    if (currentActiveGoals >= maxActiveGoals) {
      toast({
        title: 'Maximum active goals reached',
        description: `You can have a maximum of ${maxActiveGoals} active goals.`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addGoal(values);
      if (result.error) {
        throw new Error(result.error);
      }
      toast({
        title: 'Goal added',
        description: 'Your goal has been successfully created.',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'There was a problem adding your goal.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={GoalType.WEIGHT}>Target Weight</SelectItem>
                  <SelectItem value={GoalType.YOGA_SESSIONS}>Yoga Sessions</SelectItem>
                  <SelectItem value={GoalType.WORKOUT_SESSIONS}>Workout Sessions</SelectItem>
                  <SelectItem value={GoalType.TOTAL_SESSIONS}>Total Sessions</SelectItem>
                  <SelectItem value={GoalType.CUSTOM}>Custom Goal</SelectItem>
                  <SelectItem value={GoalType.EXERCISE_WEIGHT}>Exercise Weight</SelectItem>
                  <SelectItem value={GoalType.EXERCISE_REPS}>Exercise Reps</SelectItem>
                  <SelectItem value={GoalType.EXERCISE_DISTANCE}>Exercise Distance</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {goalType === GoalType.CUSTOM && (
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your goal title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {goalType === GoalType.CUSTOM && (
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Describe your goal" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="target"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Target{' '}
                {goalType === GoalType.WEIGHT
                  ? '(kg)'
                  : goalType === GoalType.EXERCISE_DISTANCE
                    ? '(km)'
                    : ''}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step={
                    goalType === GoalType.WEIGHT || goalType === GoalType.EXERCISE_DISTANCE
                      ? '0.1'
                      : '1'
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {goalType !== GoalType.WEIGHT && goalType !== GoalType.CUSTOM && (
          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Period</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={GoalPeriod.WEEK}>Per Week</SelectItem>
                    <SelectItem value={GoalPeriod.MONTH}>Per Month</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {(goalType === GoalType.EXERCISE_WEIGHT ||
          goalType === GoalType.EXERCISE_REPS ||
          goalType === GoalType.EXERCISE_DISTANCE) && (
          <FormField
            control={form.control}
            name="exerciseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exercise</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter exercise ID or name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={`w-full pl-3 text-left font-normal ${
                        !field.value && 'text-muted-foreground'
                      }`}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Goal'}
        </Button>
      </form>
    </Form>
  );
}
