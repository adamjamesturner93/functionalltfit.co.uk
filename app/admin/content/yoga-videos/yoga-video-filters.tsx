"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { YogaType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";

const propOptions = [
  "Mat",
  "Blocks",
  "Straps",
  "Blanket",
  "Bolster",
  "Chair",
  "Wall",
];

const durationOptions = [
  { value: "less15", label: "Less than 15 minutes" },
  { value: "15to30", label: "15-30 minutes" },
  { value: "30to45", label: "30-45 minutes" },
  { value: "45plus", label: "45+ minutes" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "mostViewed", label: "Most Viewed" },
  { value: "leastViewed", label: "Least Viewed" },
];

export function YogaVideoFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | string[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (Array.isArray(value)) {
      if (value.length > 0) {
        current.set(key, value.join(","));
      } else {
        current.delete(key);
      }
    } else if (value && value !== "ALL") {
      current.set(key, value);
    } else {
      current.delete(key);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/admin/content/yoga-videos${query}`);
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
          {Object.values(YogaType).map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <MultiSelect
        options={propOptions.map((prop) => ({ label: prop, value: prop }))}
        selected={searchParams.get("props")?.split(",") || []}
        onChange={(value) => updateFilter("props", value)}
        placeholder="Filter by Props"
      />

      <Select
        onValueChange={(value) => updateFilter("duration", value)}
        defaultValue={searchParams.get("duration") || "ALL"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Duration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Durations</SelectItem>
          {durationOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => updateFilter("sort", value)}
        defaultValue={searchParams.get("sort") || "newest"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
