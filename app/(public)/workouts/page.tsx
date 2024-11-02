import { getWorkouts } from "@/app/actions/workouts";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workouts | Functional Fitness",
  description:
    "Discover a variety of workouts designed to improve your strength, cardio, and overall fitness.",
};

export default async function WorkoutPage() {
  const { workouts } = await getWorkouts();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Workouts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => (
          <Link
            href={`/workouts/${workout.id}`}
            key={workout.id}
            className="group"
          >
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader className="p-0">
                <div className="relative aspect-video">
                  <Image
                    src={`/placeholder.svg?height=200&width=300&text=${encodeURIComponent(
                      workout.name
                    )}`}
                    alt={workout.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                  {workout.name}
                </CardTitle>
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {workout.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {Math.floor(workout.totalLength / 60)} min
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Dumbbell className="mr-1 h-4 w-4" />
                    {workout.equipment.length} items
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="flex flex-wrap gap-2">
                  {workout.muscleGroups.map((group) => (
                    <Badge key={group} variant="secondary">
                      {group}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
