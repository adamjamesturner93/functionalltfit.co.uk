'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { addHealthData, HealthDataInput } from '@/app/actions/health';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const healthDataSchema = z.object({
  date: z.string(),
  weight: z.number().positive(),
  bloodPressureSystolic: z.number().int().positive().optional(),
  bloodPressureDiastolic: z.number().int().positive().optional(),
  restingHeartRate: z.number().int().positive().optional(),
  sleepHours: z.number().positive().optional(),
  stressLevel: z.number().int().min(1).max(10).optional(),
});

export function HealthDataForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HealthDataInput>({
    resolver: zodResolver(healthDataSchema),
  });

  const onSubmit = async (data: HealthDataInput) => {
    setIsSubmitting(true);
    const result = await addHealthData(data);
    setIsSubmitting(false);

    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Health data added successfully',
      });
      reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Health Data</CardTitle>
        <CardDescription>Record your health data for today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" {...register('date')} />
            {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              {...register('weight', { valueAsNumber: true })}
            />
            {errors.weight && <p className="text-sm text-red-500">{errors.weight.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bloodPressureSystolic">Blood Pressure (Systolic)</Label>
            <Input
              id="bloodPressureSystolic"
              type="number"
              {...register('bloodPressureSystolic', { valueAsNumber: true })}
            />
            {errors.bloodPressureSystolic && (
              <p className="text-sm text-red-500">{errors.bloodPressureSystolic.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bloodPressureDiastolic">Blood Pressure (Diastolic)</Label>
            <Input
              id="bloodPressureDiastolic"
              type="number"
              {...register('bloodPressureDiastolic', { valueAsNumber: true })}
            />
            {errors.bloodPressureDiastolic && (
              <p className="text-sm text-red-500">{errors.bloodPressureDiastolic.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="restingHeartRate">Resting Heart Rate</Label>
            <Input
              id="restingHeartRate"
              type="number"
              {...register('restingHeartRate', { valueAsNumber: true })}
            />
            {errors.restingHeartRate && (
              <p className="text-sm text-red-500">{errors.restingHeartRate.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sleepHours">Sleep Hours</Label>
            <Input
              id="sleepHours"
              type="number"
              step="0.1"
              {...register('sleepHours', { valueAsNumber: true })}
            />
            {errors.sleepHours && (
              <p className="text-sm text-red-500">{errors.sleepHours.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="stressLevel">Stress Level (1-10)</Label>
            <Input
              id="stressLevel"
              type="number"
              min="1"
              max="10"
              {...register('stressLevel', { valueAsNumber: true })}
            />
            {errors.stressLevel && (
              <p className="text-sm text-red-500">{errors.stressLevel.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
