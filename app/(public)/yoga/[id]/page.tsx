import { getYogaVideoById } from '@/app/actions/yoga-videos';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowLeft, Dumbbell, Target } from 'lucide-react';
import { getPlaybackToken } from '@/lib/mux';
import { VideoPlayer } from '@/components/video-player';
import { getCurrentUserId } from '@/lib/auth-utils';
import { YogaVideoActions } from './yoga-video-actions';
import { CompleteButton } from './complete-button';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;
  const userId = await getCurrentUserId();
  const yogaVideo = await getYogaVideoById(id, userId);
  if (!yogaVideo) return { title: 'Yoga Video Not Found' };

  const minutes = Math.floor(yogaVideo.duration / 60);

  return {
    title: `${yogaVideo.title} - ${minutes} Minute Yoga Session | FunctionallyFit`,
    description: `${
      yogaVideo.description
    }. A ${minutes}-minute ${yogaVideo.type.toLowerCase()} yoga session with ${yogaVideo.props.join(
      ', ',
    )}.`,
    keywords: [
      'yoga',
      yogaVideo.type.toLowerCase(),
      ...yogaVideo.props,
      'fitness',
      'wellness',
      'exercise',
      'mindfulness',
    ].join(', '),
    openGraph: {
      title: `${yogaVideo.title} | FunctionallyFit Yoga`,
      description: yogaVideo.description,
      type: 'video.other',
      url: `https://functionalfitness.com/yoga/${id}`,
      images: [{ url: yogaVideo.thumbnailUrl }],
      videos: [
        {
          url: `https://stream.mux.com/${yogaVideo.muxPlaybackId}.m3u8`,
          type: 'application/x-mpegURL',
        },
      ],
    },
    twitter: {
      card: 'player',
      title: `${yogaVideo.title} | FunctionallyFit Yoga`,
      description: yogaVideo.description,
      images: [yogaVideo.thumbnailUrl],
    },
  };
}

export default async function YogaVideoPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  const yogaVideo = await getYogaVideoById(id, userId);

  if (!yogaVideo) {
    notFound();
  }

  const token = await getPlaybackToken(yogaVideo.muxPlaybackId);
  const minutes = Math.floor(yogaVideo.duration / 60);

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Link
            href="/yoga"
            className="mb-4 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Yoga Videos
          </Link>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">{yogaVideo.title}</h1>
          <p className="text-muted-foreground">{yogaVideo.description}</p>
        </div>
        <YogaVideoActions yogaVideoId={id} userId={userId} isSaved={yogaVideo.isSaved} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>{minutes} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-muted-foreground" />
            <span>{yogaVideo.props.join(', ') || 'No equipment needed'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-muted-foreground" />
            <span>{yogaVideo.type}</span>
          </div>
        </div>
        <div className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">About the Practice</h2>
            <div className="prose prose-invert max-w-none">
              <p>{yogaVideo.description}</p>
            </div>
          </section>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Workout Structure</h2>
        <div id="video-section" className="aspect-video overflow-hidden rounded-lg bg-black">
          <VideoPlayer playbackId={yogaVideo.muxPlaybackId} token={token} />
        </div>
      </div>

      <div className="flex justify-end">
        <CompleteButton userId={userId} yogaVideoId={yogaVideo.id} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: yogaVideo.title,
            description: yogaVideo.description,
            thumbnailUrl: yogaVideo.thumbnailUrl,
            uploadDate: yogaVideo.createdAt,
            duration: `PT${minutes}M`,
            contentUrl: `https://stream.mux.com/${yogaVideo.muxPlaybackId}.m3u8`,
            publisher: {
              '@type': 'Organization',
              name: 'FunctionallyFit',
              logo: {
                '@type': 'ImageObject',
                url: 'https://functionalfitness.com/logo.png',
              },
            },
            accessMode: ['visual', 'auditory'],
            accessibilityControl: ['fullScreen', 'volume'],
            accessibilityFeature: ['captions'],
          }),
        }}
      />
    </div>
  );
}
