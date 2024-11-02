import { getYogaVideos } from "@/app/actions/yoga-videos";
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
import { Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yoga Videos | Functional Fitness",
  description:
    "Explore our collection of yoga videos for mindfulness, strength building, and body exploration.",
};

export default async function YogaPage() {
  const { yogaVideos } = await getYogaVideos();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Yoga Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {yogaVideos.map((video) => (
          <Link href={`/yoga/${video.id}`} key={video.id} className="group">
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader className="p-0">
                <div className="relative aspect-video">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                  {video.title}
                </CardTitle>
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {video.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{video.type}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {Math.floor(video.duration / 60)} min
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="flex flex-wrap gap-2">
                  {video.props.map((prop) => (
                    <Badge key={prop} variant="secondary">
                      {prop}
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
