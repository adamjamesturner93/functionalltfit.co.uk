"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MembershipStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const membershipPlans = ["Basic", "Standard", "Premium", "VIP"];

export function MemberFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (value && value !== "ALL") {
      current.set(key, value);
    } else {
      current.delete(key);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/admin/users${query}`);
  };

  return (
    <div className="flex space-x-4 mb-4">
      <Select
        onValueChange={(value) => updateFilter("status", value)}
        defaultValue={searchParams.get("status") || "ALL"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          {Object.values(MembershipStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => updateFilter("plan", value)}
        defaultValue={searchParams.get("plan") || "ALL"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Plans</SelectItem>
          {membershipPlans.map((plan) => (
            <SelectItem key={plan} value={plan}>
              {plan}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
