import {
  getYogaVideoById,
  completeYogaVideo,
  bookmarkYogaVideo,
  getYogaVideoRating,
} from "@/app/actions/yoga-videos";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SharedDetailLayout } from "@/app/(public)/components/shared-layout-detail";
import { VideoPlayer } from "@/components/video-player";
import { getPlaybackToken } from "@/lib/mux";
import { getCurrentUserId } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const yogaVideo = await getYogaVideoById(params.id);
  if (!yogaVideo) return { title: "Yoga Video Not Found" };

  const minutes = Math.floor(yogaVideo.duration / 60);

  return {
    title: `${yogaVideo.title} - ${minutes} Minute Yoga Session | FunctionallyFit`,
    description: `${
      yogaVideo.description
    }. A ${minutes}-minute ${yogaVideo.type.toLowerCase()} yoga session with ${yogaVideo.props.join(
      ", "
    )}.`,
    keywords: [
      "yoga",
      yogaVideo.type.toLowerCase(),
      ...yogaVideo.props,
      "fitness",
      "wellness",
      "exercise",
      "mindfulness",
    ].join(", "),
    openGraph: {
      title: `${yogaVideo.title} | FunctionallyFit Yoga`,
      description: yogaVideo.description,
      type: "video.other",
      url: `https://functionalfitness.com/yoga/${params.id}`,
      images: [{ url: yogaVideo.thumbnailUrl }],
      videos: [
        {
          url: `https://stream.mux.com/${yogaVideo.muxPlaybackId}.m3u8`,
          type: "application/x-mpegURL",
        },
      ],
    },
    twitter: {
      card: "player",
      title: `${yogaVideo.title} | FunctionallyFit Yoga`,
      description: yogaVideo.description,
      images: [yogaVideo.thumbnailUrl],
    },
  };
}

export default async function YogaVideoPage({
  params,
}: {
  params: { id: string };
}) {
  const yogaVideo = await getYogaVideoById(params.id);
  if (!yogaVideo) notFound();

  const token = await getPlaybackToken(yogaVideo.muxPlaybackId);
  const userId = await getCurrentUserId();
  // const { rating, reviewCount } = await getYogaVideoRating(params.id);

  const handleComplete = async () => {
    "use server";
    if (userId) await completeYogaVideo(userId, params.id);
  };

  const handleBookmark = async () => {
    "use server";
    // if (userId) await bookmarkYogaVideo(userId, params.id);
  };

  const handleShare = async () => {
    "use server";
    // Implement sharing functionality
  };

  return (
    <SharedDetailLayout
      title={yogaVideo.title}
      description={yogaVideo.description}
      duration={Math.floor(yogaVideo.duration / 60)}
      date={new Date(yogaVideo.createdAt).toLocaleDateString()}
      type={yogaVideo.type}
      equipment={yogaVideo.props}
      backLink={{ href: "/yoga", label: "Back to Yoga Videos" }}
      actionButton={{ label: "Start Practice", onClick: handleComplete }}
      onBookmark={handleBookmark}
      onShare={handleShare}
      // rating={rating}
      // reviewCount={reviewCount}
    >
      <div className="space-y-6">
        <VideoPlayer
          playbackId={yogaVideo.muxPlaybackId}
          token={token}
          onProgress={handleComplete}
        />

        <Card>
          <CardHeader>
            <CardTitle>What you&apos;ll need:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {yogaVideo.props.map((prop) => (
                <li key={prop} className="text-muted-foreground">
                  {prop}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible>
          <AccordionItem value="pose-breakdown">
            <AccordionTrigger>Pose Breakdown</AccordionTrigger>
            <AccordionContent>
              {/* Add pose breakdown content */}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="breathing-guide">
            <AccordionTrigger>Breathing Guide</AccordionTrigger>
            <AccordionContent>
              {/* Add breathing guide content */}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="modifications">
            <AccordionTrigger>Modifications</AccordionTrigger>
            <AccordionContent>
              {/* Add modifications content */}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="practice-tips">
            <AccordionTrigger>Practice Tips</AccordionTrigger>
            <AccordionContent>
              {/* Add practice tips content */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </SharedDetailLayout>
  );
}
