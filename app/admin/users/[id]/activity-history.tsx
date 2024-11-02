"use client";

import React, { useEffect, useState } from "react";
import {
  getActivityHistory,
  ActivityHistoryItem,
} from "@/app/actions/activity";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dumbbell, GlassWater } from "lucide-react";

interface ActivityHistoryProps {
  userId: string;
}

export function ActivityHistory({ userId }: ActivityHistoryProps) {
  const [activities, setActivities] = useState<ActivityHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const history = await getActivityHistory(userId);
        setActivities(history);
      } catch (error) {
        console.error("Failed to fetch activity history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [userId]);

  if (isLoading) {
    return <div>Loading activity history...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Duration (minutes)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((activity) => (
          <TableRow key={activity.id}>
            <TableCell>
              {activity.type === "workout" ? (
                <Dumbbell className="h-5 w-5 text-blue-500" />
              ) : (
                <GlassWater className="h-5 w-5 text-green-500" />
              )}
            </TableCell>
            <TableCell>{activity.name}</TableCell>
            <TableCell>{format(activity.date, "PPP")}</TableCell>
            <TableCell>{activity.duration}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
