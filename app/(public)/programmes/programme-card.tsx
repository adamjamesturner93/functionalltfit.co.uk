'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BookmarkIcon, Calendar, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { toggleProgrammeSave } from '@/app/actions/programmes';

interface ProgrammeCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  intention: string;
  sessionsPerWeek: number;
  weeks: number;
  isSaved: boolean;
  userId: string | null;
}

export function ProgrammeCard({
  id,
  title,
  description,
  thumbnail,
  intention,
  sessionsPerWeek,
  weeks,
  isSaved,
  userId,
}: ProgrammeCardProps) {
  const [saved, setSaved] = useState(isSaved);

  const handleToggleSave = async () => {
    if (!userId) return;
    try {
      await toggleProgrammeSave(id, userId);
      setSaved(!saved);
    } catch (error) {
      console.error('Failed to toggle save:', error);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b p-0">
        <div className="relative aspect-video">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="line-clamp-1">{title}</CardTitle>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
          </div>
          {userId && (
            <Button variant="ghost" size="icon" className="shrink-0" onClick={handleToggleSave}>
              <BookmarkIcon className={`h-4 w-4 ${saved ? 'fill-primary' : ''}`} />
              <span className="sr-only">{saved ? 'Remove from saved' : 'Save programme'}</span>
            </Button>
          )}
        </div>
        <div className="mt-4 space-y-2">
          <Badge variant="secondary">{intention}</Badge>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              <span>{sessionsPerWeek} sessions/week</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{weeks} weeks</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/programmes/${id}`}>View Programme</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
