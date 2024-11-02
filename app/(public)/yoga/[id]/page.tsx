import { getYogaVideoById, completeYogaVideo } from "@/app/actions/yoga-videos";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Dumbbell, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getPlaybackToken } from "@/lib/mux";
import { VideoPlayer } from "@/components/video-player";
import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/auth-utils";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  const yogaVideo = await getYogaVideoById(id);
  if (!yogaVideo) return { title: "Yoga Video Not Found" };

  return {
    title: `${yogaVideo.title} | Functional Fitness Yoga`,
    description: yogaVideo.description,
    openGraph: {
      title: `${yogaVideo.title} | Functional Fitness Yoga`,
      description: yogaVideo.description,
      type: "video.other",
      url: `https://functionalfitness.com/yoga/${id}`,
      images: [{ url: yogaVideo.thumbnailUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${yogaVideo.title} | Functional Fitness Yoga`,
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
  const { id } = await params;
  const yogaVideo = await getYogaVideoById(id);

  if (!yogaVideo) {
    notFound();
  }

  const token = await getPlaybackToken(yogaVideo.muxPlaybackId);
  const userId = await getCurrentUserId();

  const handleComplete = async () => {
    "use server";
    if (userId) {
      console.log("COMPLETED");
      await completeYogaVideo(userId, id);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-2">
            {yogaVideo.title}
          </CardTitle>
          <CardDescription className="text-lg">
            {yogaVideo.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VideoPlayer
            playbackId={yogaVideo.muxPlaybackId}
            token={token}
            onProgress={handleComplete}
          />

          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-sm">
                {yogaVideo.type}
              </Badge>
              {yogaVideo.props.map((prop) => (
                <Badge key={prop} variant="secondary" className="text-sm">
                  {prop}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {Math.floor(yogaVideo.duration / 60)} minutes
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {new Date(yogaVideo.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Dumbbell className="mr-2 h-4 w-4" />
                {yogaVideo.type}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">
                What you&apos;ll need:
              </h3>
              <ul className="list-disc list-inside">
                {yogaVideo.props.map((prop) => (
                  <li key={prop}>{prop}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleComplete} className="w-full">
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Completed
          </Button>
        </CardFooter>
      </Card>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: yogaVideo.title,
            description: yogaVideo.description,
            thumbnailUrl: yogaVideo.thumbnailUrl,
            uploadDate: yogaVideo.createdAt,
            duration: `PT${Math.floor(yogaVideo.duration / 60)}M`,
            contentUrl: `https://stream.mux.com/${yogaVideo.muxPlaybackId}.m3u8`,
          }),
        }}
      />
    </div>
  );
}
