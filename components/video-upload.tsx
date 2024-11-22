'use client';

import { useCallback, useEffect, useState } from 'react';
import MuxUploader from '@mux/mux-uploader-react';
import { X } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface VideoUploadProps {
  onVideoUpload: (muxPlaybackId: string, muxAssetId: string, duration: number) => void;
  initialVideo?: string;
}

export function VideoUpload({ onVideoUpload, initialVideo }: VideoUploadProps) {
  const [video, setVideo] = useState<string | null>(initialVideo || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUploadUrl = async () => {
      try {
        const response = await fetch('/api/mux/get-upload-url');
        const data = await response.json();

        setUploadUrl(data.url);
        setUploadId(data.id);
      } catch (error) {
        console.error('Error fetching upload URL:', error);
        setError('Failed to initialize upload. Please try again.');
      }
    };

    fetchUploadUrl();
  }, []);

  const handleUploadComplete = useCallback(async () => {
    setUploading(false);
    if (!uploadId) {
      setError('Upload ID not found. Please try again.');
      return;
    }
    try {
      const response = await fetch('/api/mux/upload-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uploadId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { muxPlaybackId, muxAssetId, duration } = await response.json();
      setVideo(muxPlaybackId);
      onVideoUpload(muxPlaybackId, muxAssetId, duration);
    } catch (error) {
      console.error('Error completing upload:', error);
      setError('Failed to complete upload. Please try again.');
    }
  }, [uploadId, onVideoUpload]);

  const handleRemoveVideo = () => {
    setVideo(null);
    onVideoUpload('', '', 0);
    setError(null);
  };

  if (!uploadUrl) {
    return <div>Loading uploader...</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {video ? (
        <div className="relative aspect-video w-full">
          <video
            src={`https://stream.mux.com/${video}.m3u8`}
            controls
            className="size-full rounded-xl bg-[#0A0A0A] object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleRemoveVideo}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <MuxUploader
          endpoint={uploadUrl}
          onUploadStart={() => setUploading(true)}
          onSuccess={handleUploadComplete}
          onError={(err) => {
            console.error('Upload error:', err);
            setError(
              `Failed to upload video: ${(err as unknown as Error).message || 'Unknown error'}`,
            );
            setUploading(false);
          }}
          className="bg-background"
        >
          <Button
            type="button"
            variant="secondary"
            className="h-12 bg-white px-8 text-lg text-black hover:bg-gray-100"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload a video'}
          </Button>
        </MuxUploader>
      )}
    </div>
  );
}
