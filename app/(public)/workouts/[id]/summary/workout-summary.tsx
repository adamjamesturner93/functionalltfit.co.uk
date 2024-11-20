'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Clock,
  Weight,
  Target,
  TrendingUp,
  Share2,
  ChevronRight,
  Facebook,
  Instagram,
  LinkIcon,
  Twitter,
} from 'lucide-react';
import { shareWorkout, updateUserExerciseWeight } from '@/app/actions/workouts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { WorkoutSummary as WorkoutSummaryType } from '@/app/actions/workouts';
import { Unit } from '@prisma/client';
import { formatWeight } from '@/lib/unit-conversion';

interface WorkoutSummaryProps {
  summary: WorkoutSummaryType;
  workoutActivityId: string;
  userId: string;
  userPreferences: {
    weightUnit: Unit;
    lengthUnit: Unit;
  };
}

export function WorkoutSummary({
  summary,
  workoutActivityId,
  userId,
  userPreferences,
}: WorkoutSummaryProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [increasedWeights, setIncreasedWeights] = useState<Record<string, boolean>>({});

  const generateImage = (workoutData: WorkoutSummaryType) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = 1200;
    canvas.height = 630;

    // Set background
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(0, 0, 1200, 630);

    // Set text style
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    // Draw workout name
    ctx.font = 'bold 60px system-ui';
    ctx.fillText('Workout Summary', 600, 100);

    // Draw summary stats
    ctx.font = '40px system-ui';
    const stats = [
      `Duration: ${Math.round(workoutData.totalDuration / 60)} minutes`,
      `Total Weight: ${formatWeight(workoutData.totalWeightLifted, userPreferences.weightUnit)}`,
      `Exercises: ${workoutData.exercisesCompleted}`,
      `Personal Bests: ${
        workoutData.exercises.filter(
          (ex) =>
            ex.improvement.reps > 0 ||
            ex.improvement.weight > 0 ||
            ex.improvement.time > 0 ||
            ex.improvement.distance > 0,
        ).length
      }`,
    ];
    stats.forEach((stat, index) => {
      ctx.fillText(stat, 600, 200 + index * 70);
    });

    // Draw app logo or name
    ctx.font = 'bold 30px system-ui';
    ctx.fillText('Functionally Fit', 600, 580);

    return canvas.toDataURL('image/png');
  };

  const handleShare = async () => {
    setIsLoading(true);
    try {
      const result = await shareWorkout(workoutActivityId, userId);
      setShareLink(result.shareLink);

      const imageDataUrl = generateImage(summary);
      if (imageDataUrl) {
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('file', blob, `workout-summary-${workoutActivityId}.png`);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const { url } = await uploadResponse.json();
        setImageUrl(url);
      }

      setIsShareModalOpen(true);
    } catch (error) {
      console.error('Error sharing workout:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to generate share content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: 'Link Copied',
      description: 'The share link has been copied to your clipboard.',
    });
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`Check out my workout achievement! ${shareLink}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareToInstagram = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: 'Link Copied for Instagram',
      description: 'The share link has been copied. Paste it into your Instagram post or story.',
    });
  };

  const readyToProgressCount = summary.exercises.filter(
    (ex) => ex.targetReached && ex.mode === 'REPS',
  ).length;
  const personalBestsCount = summary.exercises.filter(
    (ex) =>
      ex.improvement.reps > 0 ||
      ex.improvement.weight > 0 ||
      ex.improvement.time > 0 ||
      ex.improvement.distance > 0,
  ).length;

  const handleIncreaseWeight = async (exerciseId: string, currentWeight: number) => {
    const newWeight = Math.ceil((currentWeight * 1.05) / 2.5) * 2.5;
    await updateUserExerciseWeight(workoutActivityId, exerciseId, newWeight, userId);
    setIncreasedWeights((prev) => ({ ...prev, [exerciseId]: true }));
    toast({
      title: 'Weight Increased',
      description: `The weight for this exercise has been increased to ${formatWeight(
        newWeight,
        userPreferences.weightUnit,
      )}.`,
    });
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor((totalSeconds * 1000) % 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds
      .toString()
      .padStart(3, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-50">
      <canvas ref={canvasRef} className="hidden" />

      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">Workout Complete!</h1>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="space-y-2 p-6 text-center">
              <Clock className="mx-auto h-6 w-6 text-slate-400" />
              <div className="text-sm text-slate-400">Duration</div>
              <div className="font-mono text-2xl font-bold">
                {formatTime(summary.totalDuration)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="space-y-2 p-6 text-center">
              <Weight className="mx-auto h-6 w-6 text-slate-400" />
              <div className="text-sm text-slate-400">Weight Lifted</div>
              <div className="text-2xl font-bold">
                {formatWeight(summary.totalWeightLifted, userPreferences.weightUnit)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="space-y-2 p-6 text-center">
              <Target className="mx-auto h-6 w-6 text-slate-400" />
              <div className="text-sm text-slate-400">Ready to Progress</div>
              <div className="text-2xl font-bold">{readyToProgressCount}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="space-y-2 p-6 text-center">
              <TrendingUp className="mx-auto h-6 w-6 text-slate-400" />
              <div className="text-sm text-slate-400">Personal Bests</div>
              <div className="text-2xl font-bold">{personalBestsCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-slate-950">
                <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-slate-800">
                  Exercise Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Achievements</h3>
                  <div className="space-y-3">
                    {summary.exercises.map(
                      (exercise) =>
                        exercise.targetReached &&
                        exercise.mode === 'REPS' && (
                          <Card key={exercise.id} className="border-slate-700 bg-slate-800">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <h4 className="font-medium">{exercise.name}</h4>
                                  <p className="text-sm text-slate-400">
                                    Target reached: {exercise.targetReps} reps
                                  </p>
                                </div>
                                {increasedWeights[exercise.exerciseId] ? (
                                  <p className="text-sm text-indigo-400">
                                    Weight increased to{' '}
                                    {formatWeight(
                                      exercise.nextWorkoutWeight,
                                      userPreferences.weightUnit,
                                    )}
                                  </p>
                                ) : (
                                  <Button
                                    onClick={() =>
                                      handleIncreaseWeight(exercise.exerciseId, exercise.weight)
                                    }
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                  >
                                    Increase to{' '}
                                    {formatWeight(
                                      exercise.nextWorkoutWeight,
                                      userPreferences.weightUnit,
                                    )}
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ),
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                {summary.exercises.map((exercise) => (
                  <Card key={exercise.id} className="border-slate-700 bg-slate-800">
                    <CardContent className="space-y-4 p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{exercise.name}</h4>
                        {exercise.targetReached ? (
                          <div className="rounded-full bg-indigo-500/20 px-2 py-1 text-xs font-medium text-indigo-400">
                            Target Reached
                          </div>
                        ) : (
                          <div className="rounded-full bg-slate-700 px-2 py-1 text-xs font-medium text-slate-400">
                            Target: {exercise.targetReps} {exercise.mode.toLowerCase()}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {exercise.performanceByRound.map((round) => (
                          <div
                            key={round.round}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-slate-400">Round {round.round}</span>
                            <div className="space-x-2">
                              <span>
                                {formatWeight(round.weight, userPreferences.weightUnit)} ×{' '}
                                {round.reps} {exercise.mode.toLowerCase()}
                              </span>
                              <span className="text-slate-500">
                                (Target: {exercise.targetReps} {exercise.mode.toLowerCase()})
                              </span>
                            </div>
                          </div>
                        ))}
                        <div className="border-t border-slate-700 pt-2">
                          <div className="flex items-center justify-between font-medium">
                            <span className="text-slate-400">Average</span>
                            <div className="space-x-2">
                              <span>
                                {formatWeight(exercise.weight, userPreferences.weightUnit)} ×{' '}
                                {exercise.reps} {exercise.mode.toLowerCase()}
                              </span>
                              <span className="text-slate-500">
                                (Target: {exercise.targetReps} {exercise.mode.toLowerCase()})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            onClick={() => router.push('/workouts')}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Workouts
          </Button>
          <Button
            onClick={handleShare}
            disabled={isLoading}
            variant="outline"
            className="flex-1 border-slate-700 hover:bg-slate-800"
          >
            <Share2 className="mr-2 h-4 w-4" />
            {isLoading ? 'Generating...' : 'Share Achievements'}
          </Button>

          <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share Your Achievement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative aspect-video">
                  <Image src={imageUrl} alt="Workout Summary" layout="fill" objectFit="contain" />
                </div>
                <div className="flex items-center space-x-2">
                  <Input value={shareLink} readOnly />
                  <Button size="icon" onClick={copyLinkToClipboard}>
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          `Check out my workout achievement!`,
                        )}&url=${encodeURIComponent(shareLink)}`,
                        '_blank',
                      )
                    }
                  >
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </Button>
                  <Button
                    onClick={() =>
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          shareLink,
                        )}`,
                        '_blank',
                      )
                    }
                  >
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </Button>
                  <Button onClick={shareToWhatsApp}>
                    <Share2 className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                  <Button onClick={shareToInstagram}>
                    <Instagram className="mr-2 h-4 w-4" />
                    Instagram
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
