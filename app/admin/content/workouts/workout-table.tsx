"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteWorkout, WorkoutWithCount } from "@/app/admin/actions/workouts";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2 } from "lucide-react";

interface WorkoutsTableProps {
  workouts: WorkoutWithCount[];
}

export function WorkoutsTable({ workouts }: WorkoutsTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteWorkout(id);
      toast({ title: "Workout deleted successfully" });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({ title: "Error deleting workout", variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Total Length</TableHead>
          <TableHead>Equipment</TableHead>
          <TableHead>Muscle Groups</TableHead>
          <TableHead>Times Completed</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workouts.map((workout) => (
          <TableRow key={workout.id}>
            <TableCell>{workout.name}</TableCell>
            <TableCell>{workout.description}</TableCell>
            <TableCell>
              {Math.floor(workout.totalLength / 60)} minutes
            </TableCell>
            <TableCell>{workout.equipment.join(", ")}</TableCell>
            <TableCell>{workout.muscleGroups.join(", ")}</TableCell>
            <TableCell>{workout._count.WorkoutActivity}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/admin/content/workouts/${workout.id}`)
                  }
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(workout.id)}
                  disabled={isDeleting === workout.id}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {isDeleting === workout.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
