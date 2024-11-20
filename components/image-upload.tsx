'use client';

import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  initialImage?: string;
}

export function ImageUpload({ onImageUpload, initialImage }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        setImage(data.url);
        onImageUpload(data.url);
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Failed to upload image. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [onImageUpload],
  );

  const handleRemoveImage = () => {
    setImage(null);
    onImageUpload('');
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
        handleImageUpload(file);
      }
    },
    [handleImageUpload],
  );

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {image ? (
        <div className="relative aspect-video w-full">
          <Image
            src={image}
            alt="Uploaded image"
            fill
            className="rounded-xl object-cover"
            loader={({ src }) => src}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="rounded-xl border border-input bg-background p-8 text-center text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="mx-auto flex flex-col items-center gap-6">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-xl font-medium text-white">Drop an image file here to upload</div>
            <div className="text-base text-muted-foreground">or</div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
                disabled={uploading}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="secondary"
                className="h-12 bg-white px-8 text-lg text-black hover:bg-gray-100"
                disabled={uploading}
                onClick={() => {
                  document.getElementById('image-upload')?.click();
                }}
              >
                {uploading ? 'Uploading...' : 'Upload an image'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
