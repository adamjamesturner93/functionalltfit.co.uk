import { Trophy } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

export function WorkoutCompletionLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900">
        <CardContent className="p-6 text-center">
          <Trophy className="mx-auto mb-4 size-12 animate-bounce text-yellow-500" />
          <h2 className="mb-2 text-2xl font-bold text-white">Congratulations!</h2>
          <p className="mb-4 text-slate-400">Your workout is complete. Saving your progress...</p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full animate-pulse rounded-full bg-indigo-600"
              style={{ width: '100%' }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
