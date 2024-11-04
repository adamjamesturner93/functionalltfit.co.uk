"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, Dumbbell, ChevronRight } from "lucide-react";

interface SetRestProps {
  restTime: number;
  nextSetEquipment: string[];
  onSkipRest: () => void;
}

export function SetRest({
  restTime,
  nextSetEquipment,
  onSkipRest,
}: SetRestProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-yellow-500/10 mb-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold">Set Completed!</h2>
        </div>

        <div className="space-y-4">
          <div className="text-center space-y-1">
            <p className="text-sm text-slate-400">Rest Time</p>
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-5 w-5 text-slate-400" />
              <span className="text-4xl font-mono font-bold">{restTime}s</span>
            </div>
          </div>
          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
            <Progress
              value={(restTime / 90) * 100}
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700"
            />
          </div>
        </div>

        {nextSetEquipment.length > 0 && (
          <div className="space-y-3 bg-slate-950 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-400">
              Next Set Equipment:
            </h3>
            <ul className="space-y-2">
              {nextSetEquipment.map((equipment, index) => (
                <li key={index} className="flex items-center gap-2 text-lg">
                  <Dumbbell className="h-5 w-5 text-slate-400" />
                  {equipment}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          onClick={onSkipRest}
          className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg"
        >
          Skip Rest
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
