import { getProgramme } from '@/app/actions/programmes';
import { getWorkouts } from '@/app/actions/workouts';
import { getYogaVideos } from '@/app/actions/yoga-videos';
import ProgrammeFormClient from './ProgrammeFormClient';
import { Programme } from '@/lib/schemas/programme';

export default async function ProgrammeFormPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const isNewProgramme = id === 'new';

  let initialProgramme: Programme | null = null;
  if (!isNewProgramme) {
    initialProgramme = await getProgramme(id);
    if (!initialProgramme) {
      throw new Error(`Programme with id ${id} not found`);
    }
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
