import { getYogaVideoById } from "@/app/actions/yoga-videos";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { Metadata } from "next";

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

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {yogaVideo.title}
          </CardTitle>
          <CardDescription>{yogaVideo.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video mb-6">
            <iframe
              src={yogaVideo.url}
              title={yogaVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            <Badge variant="outline">{yogaVideo.type}</Badge>
            {yogaVideo.props.map((prop) => (
              <Badge key={prop} variant="secondary">
                {prop}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {Math.floor(yogaVideo.duration / 60)} minutes
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date(yogaVideo.createdAt).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Start Yoga Session</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
