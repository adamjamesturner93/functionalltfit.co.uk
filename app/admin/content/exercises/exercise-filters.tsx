"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ExerciseType, ExerciseMode } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const muscleGroups = [
  "Biceps",
  "Triceps",
  "Deltoids",
  "Pectorals",
  "Trapezius",
  "Latissimus Dorsi",
  "Rhomboids",
  "Erector Spinae",
  "Rectus Abdominis",
  "Obliques",
  "Quadriceps",
  "Hamstrings",
  "Calves",
  "Gluteus Maximus",
];

export function ExerciseFilters() {
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
    router.push(`/admin/content/exercises${query}`);
  };

  return (
    <div className="flex space-x-4 mb-4">
      <Select
        onValueChange={(value) => updateFilter("type", value)}
        defaultValue={searchParams.get("type") || "ALL"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Types</SelectItem>
          {Object.values(ExerciseType).map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => updateFilter("mode", value)}
        defaultValue={searchParams.get("mode") || "ALL"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Modes</SelectItem>
          {Object.values(ExerciseMode).map((mode) => (
            <SelectItem key={mode} value={mode}>
              {mode}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => updateFilter("muscleGroup", value)}
        defaultValue={searchParams.get("muscleGroup") || "ALL"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Muscle Group" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Muscle Groups</SelectItem>
          {muscleGroups.map((group) => (
            <SelectItem key={group} value={group}>
              {group}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
