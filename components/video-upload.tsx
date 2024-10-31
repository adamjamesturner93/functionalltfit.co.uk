"use client";

import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VideoUploadProps {
  onVideoUpload: (url: string) => void;
  initialVideo?: string;
}

export function VideoUpload({ onVideoUpload, initialVideo }: VideoUploadProps) {
  const [video, setVideo] = useState<string | null>(initialVideo || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVideoUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload-video", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload video");
        }

        const data = await response.json();
        setVideo(data.url);
        onVideoUpload(data.url);
      } catch (error) {
        console.error("Error uploading video:", error);
        setError("Failed to upload video. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [onVideoUpload]
  );

  const handleRemoveVideo = () => {
    setVideo(null);
    onVideoUpload("");
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (file) {
        handleVideoUpload(file);
      }
    },
    [handleVideoUpload]
  );

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {video ? (
        <div className="relative w-full">
          <video src={video} controls className="w-full rounded-md" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemoveVideo}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-1 text-sm text-gray-600">
            Click to upload or drag and drop
          </p>
        </div>
      )}
      <Input
        type="file"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleVideoUpload(file);
          }
        }}
        disabled={uploading}
        className="hidden"
        id="video-upload"
      />
      <label htmlFor="video-upload">
        <Button asChild disabled={uploading}>
          <span>{uploading ? "Uploading..." : "Upload Video"}</span>
        </Button>
      </label>
    </div>
  );
}
