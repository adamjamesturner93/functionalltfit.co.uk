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
import { useToast } from '@/hooks/use-toast';
import { addBodyMeasurement } from '@/app/actions/health';

const bodyMeasurementSchema = z.object({
  date: z.string(),
  weight: z.string().transform(Number),
  calve: z.string().transform(Number).optional(),
  thigh: z.string().transform(Number).optional(),
  waist: z.string().transform(Number).optional(),
  hips: z.string().transform(Number).optional(),
  butt: z.string().transform(Number).optional(),
  chest: z.string().transform(Number).optional(),
  arm: z.string().transform(Number).optional(),
});

type BodyMeasurementFormValues = z.infer<typeof bodyMeasurementSchema>;

export function QuickAddForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<BodyMeasurementFormValues>({
    resolver: zodResolver(bodyMeasurementSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      weight: 0,
      calve: 0,
      thigh: 0,
      waist: 0,
      hips: 0,
      butt: 0,
      chest: 0,
      arm: 0,
    },
  });

  async function onSubmit(values: BodyMeasurementFormValues) {
    setIsSubmitting(true);
    try {
      const result = await addBodyMeasurement(values);
      if (result.error) {
        throw new Error(result.error);
      }
      toast({
        title: 'Measurements added',
        description: 'Your measurements have been successfully recorded.',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'There was a problem adding your measurements.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chest (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="waist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waist (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hips"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hips (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="butt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Butt (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arm (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="thigh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thigh (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="calve"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calve (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Measurements'}
        </Button>
      </form>
    </Form>
  );
}
