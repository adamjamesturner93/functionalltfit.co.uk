import Link from "next/link";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { YogaVideo } from "@prisma/client";

export function YogaCard({
  id,
  title,
  description,
  duration,
  thumbnailUrl,
  type,
  props,
}: YogaVideo) {
  return (
    <Card className="group hover:shadow-lg transition-all overflow-hidden flex flex-col">
      <div className="relative aspect-video">
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <PlayCircle className="w-12 h-12 text-white" />
        </div>
      </div>
      <CardHeader className="space-y-1 flex-1">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant="secondary" className="whitespace-nowrap shrink-0">
            {Math.floor(duration / 60)} min
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="capitalize">
            {type.toLowerCase()}
          </Badge>
          {props.map((prop) => (
            <Badge key={prop} variant="secondary">
              {prop}
            </Badge>
          ))}
        </div>
        <Button className="w-full" asChild>
          <Link href={`/yoga/${id}`}>Start Practice</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
