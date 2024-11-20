'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, PlayCircle, XCircle } from 'lucide-react';
import { toggleProgrammeSave, startProgramme, leaveProgramme } from '@/app/actions/programmes';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface ProgrammeActionsProps {
  programmeId: string;
  userId: string | null;
  isSaved: boolean;
  isActive: boolean;
}

export function ProgrammeActions({
  programmeId,
  userId,
  isSaved,
  isActive,
}: ProgrammeActionsProps) {
  const [saved, setSaved] = useState(isSaved);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleToggleSave = async () => {
    if (!userId) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save programmes',
        variant: 'destructive',
      });
      return;
    }

    try {
      await toggleProgrammeSave(programmeId, userId);
      setSaved(!saved);
      toast({
        title: saved ? 'Programme removed from saved' : 'Programme saved',
        duration: 2000,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to save programme',
        variant: 'destructive',
      });
    }
  };

  const handleStartProgramme = async () => {
    if (!userId) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to start a programme',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await startProgramme(userId, programmeId);
      toast({
        title: 'Programme started',
        description: 'You can now track your progress in the dashboard',
      });
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to start programme',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveProgramme = async () => {
    if (!userId) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to leave a programme',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await leaveProgramme(userId, programmeId);
      toast({
        title: 'Programme left',
        description: 'You have successfully left the programme',
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to leave programme',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={handleToggleSave}>
        <BookmarkIcon className={`mr-2 h-4 w-4 ${saved ? 'fill-current' : ''}`} />
        {saved ? 'Saved' : 'Save Programme'}
      </Button>

      {isActive ? (
        <Button onClick={handleLeaveProgramme} disabled={isLoading} size="sm" variant="destructive">
          <XCircle className="mr-2 h-4 w-4" />
          Leave Programme
        </Button>
      ) : (
        <Button onClick={handleStartProgramme} disabled={isLoading} size="sm">
          <PlayCircle className="mr-2 h-4 w-4" />
          Start Programme
        </Button>
      )}
    </div>
  );
}
