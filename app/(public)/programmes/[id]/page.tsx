import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Dumbbell, GlassWater } from "lucide-react";
import { Metadata } from "next";
import {
  getProgramme,
  getUserProgramme,
  startProgramme,
  leaveProgramme,
} from "@/app/actions/programmes";
import { getWorkoutById } from "@/app/actions/workouts";
import { getYogaVideoById } from "@/app/actions/yoga-videos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;

  const programme = await getProgramme(id);
  if (!programme) {
    return {
      title: "Programme Not Found | FunctionallyFit",
    };
  }
  return {
    title: `${programme.title} | FunctionallyFit`,
    description: programme.description,
    openGraph: {
      title: `${programme.title} | FunctionallyFit`,
      description: programme.description,
      type: "website",
      url: `https://functionallyfit.com/programmes/${id}`,
    },
  };
}

interface ActivityWithDetails {
  week: number;
  day: number;
  activityType: "WORKOUT" | "YOGA";
  workoutId: string | null;
  yogaVideoId: string | null;
  name: string;
}

interface PageProps {
  params: { id: string };
}

export default async function ProgrammePage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const { id } = await params;

  const programme = await getProgramme(id);
  if (!programme) {
    notFound();
  }

  const userProgramme = await getUserProgramme(userId);

  const isActiveProgramme = userProgramme?.programme.id === id;

  const equipmentSet = new Set<string>();

  const activitiesWithDetails: ActivityWithDetails[] = await Promise.all(
    programme.activities.map(async (activity) => {
      if (activity.activityType === "WORKOUT" && activity.workoutId) {
        const workout = await getWorkoutById(activity.workoutId);
        if (workout) {
          workout.equipment.forEach((item) => equipmentSet.add(item));
          return { ...activity, name: workout.name };
        }
      } else if (activity.activityType === "YOGA" && activity.yogaVideoId) {
        const yogaVideo = await getYogaVideoById(activity.yogaVideoId);
        if (yogaVideo) {
          return { ...activity, name: yogaVideo.title };
        }
      }
      return { ...activity, name: "Unknown Activity" };
    })
  );

  const equipment = Array.from(equipmentSet);

  const handleStartProgramme = async () => {
    "use server";
    await startProgramme(userId, id);
  };

  const handleLeaveProgramme = async () => {
    "use server";
    await leaveProgramme(userId, id);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Image
          src={programme.thumbnail}
          alt={programme.title}
          width={600}
          height={400}
          className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
        />
      </div>
      <h1 className="text-3xl font-bold mb-4">{programme.title}</h1>
      <p className="text-muted-foreground mb-4">{programme.description}</p>
      <div className="mb-6">
        <p>
          <strong className="text-muted-foreground">Intention:</strong>{" "}
          {programme.intention}
        </p>
        <p>
          <strong className="text-muted-foreground">Sessions per week:</strong>{" "}
          {programme.sessionsPerWeek}
        </p>
        <p>
          <strong className="text-muted-foreground">Duration:</strong>{" "}
          {programme.weeks} weeks
        </p>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Equipment Needed</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            {equipment.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <h2 className="text-2xl font-semibold mb-4">Weekly Schedule</h2>
      {Array.from({ length: programme.weeks }).map((_, weekIndex) => (
        <Card key={weekIndex} className="mb-6">
          <CardHeader>
            <CardTitle>Week {weekIndex + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activitiesWithDetails
                .filter((activity) => activity.week === weekIndex + 1)
                .sort((a, b) => a.day - b.day)
                .map((activity) => (
                  <Card key={`${activity.week}-${activity.day}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        {activity.activityType === "WORKOUT" ? (
                          <Dumbbell className="mr-2" />
                        ) : (
                          <GlassWater className="mr-2" />
                        )}
                        Day {activity.day}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{activity.name}</p>
                      <Button asChild variant="link" className="p-0 mt-2">
                        <Link
                          href={
                            activity.activityType === "WORKOUT"
                              ? `/workouts/${activity.workoutId}`
                              : `/yoga/${activity.yogaVideoId}`
                          }
                        >
                          View Details
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
      {isActiveProgramme ? (
        <form action={handleLeaveProgramme}>
          <Button type="submit" variant="destructive">
            Leave Programme
          </Button>
        </form>
      ) : (
        <form action={handleStartProgramme}>
          <Button type="submit">Start Programme</Button>
        </form>
      )}
    </div>
  );
}
