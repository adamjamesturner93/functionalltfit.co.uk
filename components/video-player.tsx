'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import Mux from 'mux-embed';

interface VideoPlayerProps {
  playbackId: string;
  token: string;
  onProgress?: () => void;
}

export function VideoPlayer({ playbackId, token, onProgress }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const src = `https://stream.mux.com/${playbackId}.m3u8?token=${token}`;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      console.error(
        "This browser doesn't support MSE https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API",
      );
    }

    if (process.env.NEXT_PUBLIC_MUX_ENV_KEY) {
      Mux.monitor(video, {
        debug: false,
        data: {
          env_key: process.env.NEXT_PUBLIC_MUX_ENV_KEY,
          player_name: 'Custom Player',
          player_init_time: Date.now(),
          video_id: playbackId,
          video_title: playbackId,
        },
      });
    }

    const handleTimeUpdate = () => {
      if (onProgress && video.duration) {
        const progress = video.currentTime / video.duration;
        if (progress >= 0.9) {
          onProgress();
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      if (process.env.NEXT_PUBLIC_MUX_ENV_KEY) {
        Mux.destroyMonitor(video);
      }
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [playbackId, token, onProgress]);

  return (
    <div className="aspect-video">
      <video ref={videoRef} controls playsInline className="h-full w-full rounded-lg" />
    </div>
  );
}
