'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { completeYogaVideo } from '@/app/actions/yoga-videos';
import { Button } from '@/components/ui/button';

interface CompleteButtonProps {
  yogaVideoId: string;
  userId: string | null;
}

export function CompleteButton({ yogaVideoId, userId }: CompleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    if (!userId || isCompleted) return;
    setIsLoading(true);
    try {
      await completeYogaVideo(userId, yogaVideoId);
      setIsCompleted(true);
    } catch (error) {
      console.error('Failed to mark video as completed:', error);
    } finally {
      setIsLoading(false);
    }
    router.refresh();
  };

  return (
    <Button
      onClick={handleComplete}
      className="bg-primary hover:bg-primary/90"
      disabled={isLoading || isCompleted}
    >
      <CheckCircle className="mr-2 size-4" aria-hidden="true" />
      {isCompleted ? 'Class Completed' : 'Mark as Completed'}
    </Button>
  );
}
