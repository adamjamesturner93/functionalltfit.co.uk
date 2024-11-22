'use client';

import { useState } from 'react';
import { BookmarkIcon, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { toggleYogaVideoSave } from '@/app/actions/yoga-videos';
import { Button } from '@/components/ui/button';

interface YogaVideoActionsProps {
  yogaVideoId: string;
  userId: string | null;
  isSaved: boolean;
}

export function YogaVideoActions({ yogaVideoId, userId, isSaved }: YogaVideoActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const router = useRouter();

  const handleToggleSave = async () => {
    if (!userId) return;
    setIsLoading(true);
    await toggleYogaVideoSave(yogaVideoId, userId);
    setSaved(!saved);
    setIsLoading(false);
    router.refresh();
  };

  const handleStartPractice = () => {
    document.querySelector('#video-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="flex gap-2">
      {userId && (
        <Button
          onClick={handleToggleSave}
          variant="secondary"
          size="sm"
          className="min-w-[100px]"
          disabled={isLoading}
        >
          <BookmarkIcon className={`mr-2 size-4 ${saved ? 'fill-current' : ''}`} />
          {saved ? 'Saved' : 'Save'}
        </Button>
      )}
      <Button size="sm" className="min-w-[140px]" onClick={handleStartPractice}>
        <Play className="mr-2 size-4" />
        Start Practice
      </Button>
    </div>
  );
}
