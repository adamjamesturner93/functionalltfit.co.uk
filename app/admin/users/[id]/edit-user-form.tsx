"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  MembershipStatus,
  MembershipPlan,
  UserRole,
} from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser, UserInput } from "@/app/admin/actions/users";
import { useToast } from "@/hooks/use-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
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
      toast({ title: "User updated successfully" });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({ title: "Error updating user", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <Input {...field} id={field.name} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input {...field} id={field.name} type="email" />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="dateOfBirth"
        control={control}
        render={({ field }) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>
            <DatePicker
              wrapperClassName="w-full"
              selected={field.value}
              onChange={(date: Date | null) => field.onChange(date)}
              dateFormat="dd MMM yyyy"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholderText="Select date of birth"
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name="membershipStatus"
        control={control}
        render={({ field }) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700"
            >
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
              <p className="text-red-500 text-sm">
                {errors.membershipStatus.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name="membershipPlan"
        control={control}
        render={({ field }) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700"
            >
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
              <p className="text-red-500 text-sm">
                {errors.membershipPlan.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700"
            >
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
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role.message}</p>
            )}
          </div>
        )}
      />

      <Button type="submit">Update User</Button>
    </form>
  );
}
