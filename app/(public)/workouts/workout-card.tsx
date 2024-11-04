import Link from "next/link";
import { Dumbbell, BookmarkIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WorkoutCardProps {
  id: string;
  name: string;
  description: string | null;
  totalLength: number;
  equipment: string[];
  muscleGroups: string[];
  isSaved?: boolean;
  userId?: string | null;
  onSaveToggle?: () => Promise<void>;
}

export function WorkoutCard({
  id,
  name,
  description,
  totalLength,
  equipment,
  muscleGroups,
  isSaved = false,
  userId,
  onSaveToggle,
}: WorkoutCardProps) {
  return (
    <Card className="group relative bg-background border-border h-full flex flex-col">
      <CardHeader className="space-y-1 flex-grow">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-1">{name}</CardTitle>
          <Badge variant="secondary" className="ml-2 shrink-0">
            {Math.floor(totalLength / 60)} min
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <div className="space-y-4">
          {muscleGroups.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {muscleGroups.slice(0, 3).map((group) => (
                <Badge key={group} variant="outline">
                  {group}
                </Badge>
              ))}
              {muscleGroups.length > 3 && (
                <Badge variant="outline">+{muscleGroups.length - 3}</Badge>
              )}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Dumbbell className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground line-clamp-1">
              {equipment.length ? equipment.join(", ") : "No equipment"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <Button className="w-full mr-2" asChild>
              <Link href={`/workouts/${id}`}>View Workout</Link>
            </Button>
            {userId && onSaveToggle && (
              <form action={onSaveToggle}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className={
                    isSaved
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }
                >
                  <BookmarkIcon
                    className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                  />
                  <span className="sr-only">
                    {isSaved ? "Unsave workout" : "Save workout"}
                  </span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
