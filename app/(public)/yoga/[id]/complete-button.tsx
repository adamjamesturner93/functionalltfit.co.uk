'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { completeYogaVideo } from '@/app/actions/yoga-videos';
import { useRouter } from 'next/navigation';

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
      <CheckCircle className="mr-2 h-4 w-4" aria-hidden="true" />
      {isCompleted ? 'Class Completed' : 'Mark as Completed'}
    </Button>
  );
}
