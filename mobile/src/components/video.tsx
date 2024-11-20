import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { recordVideoWatch } from '../api/videoWatch';

interface VideoPlayerProps {
  videoUrl: string;
  videoId: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, videoId }) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [hasRecordedWatch, setHasRecordedWatch] = useState(false);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, []);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setStatus(status);

    if (status.isLoaded && !hasRecordedWatch) {
      // Record the watch event when the video starts playing
      if (status.isPlaying) {
        recordVideoWatch(videoId)
          .then(() => setHasRecordedWatch(true))
          .catch((error) => console.error('Failed to record video watch:', error));
      }
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: videoUrl }}
        useNativeControls
        resizeMode="contain"
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 300,
  },
});
