import { getProgramme } from "@/app/actions/programmes";
import { getWorkouts } from "@/app/actions/workouts";
import { getYogaVideos } from "@/app/actions/yoga-videos";
import ProgrammeFormClient from "./ProgrammeFormClient";

export default async function ProgrammeFormPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const isNewProgramme = id === "new";

  let initialProgramme = null;
  if (!isNewProgramme) {
    initialProgramme = await getProgramme(id);
  }

  const { workouts } = await getWorkouts();
  const { yogaVideos } = await getYogaVideos();

  return (
    <ProgrammeFormClient
      initialProgramme={initialProgramme}
      workouts={workouts}
      yogaVideos={yogaVideos}
      id={id}
    />
  );
}
