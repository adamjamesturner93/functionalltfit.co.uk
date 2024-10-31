"use client";

import { useState } from "react";
import { Exercise } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteExercise } from "@/app/admin/actions/exercises";
import { useToast } from "@/hooks/use-toast";

interface ExercisesTableProps {
  exercises: Exercise[];
}

export function ExercisesTable({ exercises }: ExercisesTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteExercise(id);
      toast({ title: "Exercise deleted successfully" });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({ title: "Error deleting exercise", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead>Muscle Groups</TableHead>
          <TableHead>Equipment</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exercises.map((exercise) => (
          <TableRow key={exercise.id}>
            <TableCell>{exercise.name}</TableCell>
            <TableCell>{exercise.type}</TableCell>
            <TableCell>{exercise.mode}</TableCell>
            <TableCell>{exercise.muscleGroups.join(", ")}</TableCell>
            <TableCell>{exercise.equipment}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/admin/content/exercises/${exercise.id}`)
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(exercise.id)}
                  disabled={deletingId === exercise.id}
                >
                  {deletingId === exercise.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
