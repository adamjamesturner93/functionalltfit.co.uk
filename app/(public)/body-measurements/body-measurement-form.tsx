"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addBodyMeasurement, BodyMeasurementInput } from "@/app/actions/health";

const bodyMeasurementSchema = z.object({
  date: z.string(),
  weight: z.number().positive(),
  calve: z.number().positive().optional(),
  thigh: z.number().positive().optional(),
  waist: z.number().positive().optional(),
  hips: z.number().positive().optional(),
  butt: z.number().positive().optional(),
  chest: z.number().positive().optional(),
  arm: z.number().positive().optional(),
});

const steps = [
  { name: "Basic", fields: ["date", "weight"] },
  { name: "Lower Body", fields: ["calve", "thigh", "waist", "hips", "butt"] },
  { name: "Upper Body", fields: ["chest", "arm"] },
];

export function BodyMeasurementForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BodyMeasurementInput>({
    resolver: zodResolver(bodyMeasurementSchema),
  });

  const onSubmit = async (data: BodyMeasurementInput) => {
    setIsSubmitting(true);
    const result = await addBodyMeasurement(data);
    setIsSubmitting(false);

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Body measurements added successfully",
      });
      setCurrentStep(0);
    }
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Body Measurements</CardTitle>
        <CardDescription>Record your weekly body measurements</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {steps[currentStep].fields.map((field) => (
            <div key={field} className="space-y-2 mb-4">
              <Label htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input
                id={field}
                type={field === "date" ? "date" : "number"}
                step={field === "date" ? undefined : "0.1"}
                {...register(field as keyof BodyMeasurementInput, {
                  valueAsNumber: field !== "date",
                })}
              />
              {errors[field as keyof BodyMeasurementInput] && (
                <p className="text-red-500 text-sm">
                  {errors[field as keyof BodyMeasurementInput]?.message}
                </p>
              )}
            </div>
          ))}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {currentStep > 0 && (
          <Button onClick={prevStep} variant="outline">
            Previous
          </Button>
        )}
        {currentStep < steps.length - 1 ? (
          <Button onClick={nextStep}>Next</Button>
        ) : (
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
