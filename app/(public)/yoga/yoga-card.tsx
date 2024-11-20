'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle, BookmarkIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toggleYogaVideoSave } from '@/app/actions/yoga-videos';
import { useToast } from '@/hooks/use-toast';

interface YogaCardProps {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl: string;
  type: string;
  props: string[];
  isSaved: boolean;
  userId: string | null;
}

export function YogaCard({
  id,
  title,
  description,
  duration,
  thumbnailUrl,
  type,
  props,
  isSaved: initialIsSaved,
  userId,
}: YogaCardProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const { toast } = useToast();

  const handleToggleSave = async () => {
    if (!userId) return;

    // Optimistic update
    setIsSaved(!isSaved);

    try {
      await toggleYogaVideoSave(id, userId);
      toast({
        description: `Yoga video ${isSaved ? 'removed from' : 'added to'} saved videos`,
        variant: 'default',
      });
    } catch (error) {
      console.error(error);
      toast({
        description: `Failed to update saved yoga videos`,
        variant: 'default',
      });
      setIsSaved(isSaved);
    }
  };

  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-video">
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
          <PlayCircle className="h-12 w-12 text-white" />
        </div>
      </div>
      <CardHeader className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant="secondary" className="shrink-0 whitespace-nowrap">
            {Math.floor(duration / 60)} min
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
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
        <div className="flex items-center justify-between">
          <Button className="mr-2 w-full" asChild>
            <Link href={`/yoga/${id}`}>Start Practice</Link>
          </Button>
          {userId && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleToggleSave}
              className={isSaved ? 'text-primary' : 'text-muted-foreground hover:text-primary'}
            >
              <BookmarkIcon className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="sr-only">{isSaved ? 'Unsave yoga video' : 'Save yoga video'}</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
