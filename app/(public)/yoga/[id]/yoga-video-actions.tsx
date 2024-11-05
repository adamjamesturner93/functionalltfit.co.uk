"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, Play } from "lucide-react";
import { toggleYogaVideoSave } from "@/app/actions/yoga-videos";
import { useRouter } from "next/navigation";

interface YogaVideoActionsProps {
  yogaVideoId: string;
  userId: string | null;
  isSaved: boolean;
}

export function YogaVideoActions({
  yogaVideoId,
  userId,
  isSaved,
}: YogaVideoActionsProps) {
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
    document.querySelector("#video-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
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
          <BookmarkIcon
            className={`mr-2 h-4 w-4 ${saved ? "fill-current" : ""}`}
          />
          {saved ? "Saved" : "Save"}
        </Button>
      )}
      <Button size="sm" className="min-w-[140px]" onClick={handleStartPractice}>
        <Play className="mr-2 h-4 w-4" />
        Start Practice
      </Button>
    </div>
  );
}
