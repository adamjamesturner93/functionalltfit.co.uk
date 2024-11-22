import { getYogaVideoById } from '@/app/actions/yoga-videos';

import YogaVideoFormClient from './yoga-video-form-client';

export default async function YogaVideoFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNewYogaVideo = id === 'new';

  let initialYogaVideo = null;
  if (!isNewYogaVideo) {
    initialYogaVideo = await getYogaVideoById(id);
  }

  return <YogaVideoFormClient initialYogaVideo={initialYogaVideo} id={id} />;
}
