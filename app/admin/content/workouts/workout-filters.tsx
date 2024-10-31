"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const equipmentOptions = [
  "Dumbbells",
  "Barbell",
  "Kettlebell",
  "Resistance Bands",
  "Pull-up Bar",
  "Jump Rope",
];

const muscleGroups = [
  "Full Body",
  "Upper Body",
  "Lower Body",
  "Core",
  "Chest",
  "Back",
  "Arms",
  "Shoulders",
  "Legs",
  "Glutes",
];

export function WorkoutFilters() {
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
    router.push(`/admin/content/workouts${query}`);
  };

  return (
    <div className="flex space-x-4 mb-4">
      <Select
        onValueChange={(value) => updateFilter("equipment", value)}
        defaultValue={searchParams.get("equipment") || "ALL"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Equipment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Equipment</SelectItem>
          {equipmentOptions.map((equipment) => (
            <SelectItem key={equipment} value={equipment}>
              {equipment}
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

      <Input
        type="number"
        placeholder="Min Duration (minutes)"
        className="w-[180px]"
        value={searchParams.get("minDuration") || ""}
        onChange={(e) => updateFilter("minDuration", e.target.value)}
      />

      <Input
        type="number"
        placeholder="Max Duration (minutes)"
        className="w-[180px]"
        value={searchParams.get("maxDuration") || ""}
        onChange={(e) => updateFilter("maxDuration", e.target.value)}
      />
    </div>
  );
}
