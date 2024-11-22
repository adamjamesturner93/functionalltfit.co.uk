'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MembershipPlan, MembershipStatus, User, UserRole } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { updateUser, UserInput } from '@/app/actions/users';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.date().nullable(),
  membershipStatus: z.nativeEnum(MembershipStatus),
  membershipPlan: z.nativeEnum(MembershipPlan),
  role: z.nativeEnum(UserRole),
});

type UserFormData = z.infer<typeof userSchema>;

interface EditUserFormProps {
  user: User;
}

export function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      membershipStatus: user.membershipStatus,
      membershipPlan: user.membershipPlan,
      role: user.role,
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      await updateUser(user.id, data as UserInput);
      toast({ title: 'User updated successfully' });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({ title: 'Error updating user', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium text-muted">
              Name
            </label>
            <Input {...field} id={field.name} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium text-muted">
              Email
            </label>
            <Input {...field} id={field.name} type="email" />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
        )}
      />

      <Controller
        name="dateOfBirth"
        control={control}
        render={({ field }) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium text-muted">
              Date of Birth
            </label>
            <DatePicker
              selected={field.value}
              onChange={(date: Date | null) => field.onChange(date)}
              dateFormat="dd MMM yyyy"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="membershipStatus"
        control={control}
        render={({ field }) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium text-muted">
              Membership Status
            </label>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select Membership Status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(MembershipStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.membershipStatus && (
              <p className="text-sm text-red-500">{errors.membershipStatus.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="membershipPlan"
        control={control}
        render={({ field }) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium text-muted">
              Membership Plan
            </label>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select Membership Plan" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(MembershipPlan).map((plan) => (
                  <SelectItem key={plan} value={plan}>
                    {plan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.membershipPlan && (
              <p className="text-sm text-red-500">{errors.membershipPlan.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium text-muted">
              Role
            </label>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
          </div>
        )}
      />

      <Button type="submit">Update User</Button>
    </form>
  );
}
