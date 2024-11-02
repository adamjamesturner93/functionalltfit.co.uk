import { getProgramme } from "@/app/actions/programmes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default async function ProgrammePage({ params }) {
  const { id } = await params;
  const programme = await getProgramme(id);

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
      <p className="text-gray-600 mb-4">{programme.description}</p>
      <div className="mb-6">
        <p>
          <strong className="text-muted">Intention:</strong>{" "}
          {programme.intention}
        </p>
        <p>
          <strong className="text-muted">Sessions per week:</strong>{" "}
          {programme.sessionsPerWeek}
        </p>
        <p>
          <strong className="text-muted">Duration:</strong> {programme.weeks}{" "}
          weeks
        </p>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Weekly Schedule</h2>
      {Array.from({ length: programme.weeks }).map((_, weekIndex) => (
        <div key={weekIndex} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Week {weekIndex + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programme.activities
              .filter((activity) => activity.week === weekIndex + 1)
              .sort((a, b) => a.day - b.day)
              .map((activity) => (
                <div
                  key={`${activity.week}-${activity.day}`}
                  className="border rounded-lg p-4"
                >
                  <h4 className="font-semibold mb-2">Day {activity.day}</h4>
                  <p>
                    {activity.activityType === "WORKOUT" ? "Workout" : "Yoga"}
                  </p>
                  <Link
                    href={
                      activity.activityType === "WORKOUT"
                        ? `/workouts/${activity.workoutId}`
                        : `/yoga/${activity.yogaVideoId}`
                    }
                  >
                    <Button variant="link">View Details</Button>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      ))}
      <Button>Start Programme</Button>
    </div>
  );
}
