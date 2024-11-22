import { BookmarkIcon, Dumbbell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface WorkoutCardProps {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string;
  totalLength: number;
  equipment: string[];
  muscleGroups: string[];
  isSaved?: boolean;
  userId?: string | null;
  onSaveToggle?: () => Promise<void>;
}

export function WorkoutCard({
  id,
  name,
  description,
  totalLength,
  equipment,
  muscleGroups,
  isSaved = false,
  userId,
  onSaveToggle,
}: WorkoutCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-video">
        <Image
          src={'/uploads/q2eLjwPDWyHpdKYgiZBYv-Screenshot 2024-05-31 at 14.36.55.png'}
          alt={''}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <CardHeader className="grow space-y-1">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-xl">{name}</CardTitle>
          <Badge variant="secondary" className="ml-2 shrink-0">
            {Math.floor(totalLength / 60)} min
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex grow flex-col justify-end">
        <div className="space-y-4">
          {muscleGroups.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {muscleGroups.slice(0, 3).map((group) => (
                <Badge key={group} variant="outline">
                  {group}
                </Badge>
              ))}
              {muscleGroups.length > 3 && (
                <Badge variant="outline">+{muscleGroups.length - 3}</Badge>
              )}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Dumbbell className="size-4 shrink-0 text-muted-foreground" />
            <span className="line-clamp-1 text-muted-foreground">
              {equipment.length ? equipment.join(', ') : 'No equipment'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <Button className="mr-2 w-full" asChild>
              <Link href={`/workouts/${id}`}>View Workout</Link>
            </Button>
            {userId && onSaveToggle && (
              <form action={onSaveToggle}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className={isSaved ? 'text-primary' : 'text-muted-foreground hover:text-primary'}
                >
                  <BookmarkIcon className={`size-4 ${isSaved ? 'fill-current' : ''}`} />
                  <span className="sr-only">{isSaved ? 'Unsave workout' : 'Save workout'}</span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
