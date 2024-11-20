import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { VideoPlayer } from '../components/VideoPlayer';
import { YogaVideo } from '../types';

interface YogaVideoScreenProps {
  route: {
    params: {
      video: YogaVideo;
    };
  };
}

export const YogaVideoScreen: React.FC<YogaVideoScreenProps> = ({ route }) => {
  const { video } = route.params;

  return (
    <ScrollView style={styles.container}>
      <VideoPlayer videoUrl={video.videoUrl} videoId={video.id} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{video.title}</Text>
        <Text style={styles.description}>{video.description}</Text>
        <Text style={styles.details}>Duration: {video.duration} seconds</Text>
        <Text style={styles.details}>Type: {video.type}</Text>
        <Text style={styles.details}>Props: {video.props.join(', ')}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  details: {
    fontSize: 14,
    marginBottom: 4,
  },
});
