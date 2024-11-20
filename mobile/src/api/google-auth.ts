import { GoogleSignin } from '@react-native-google-signin/google-signin';
import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID', // Get this from your Google Console
});

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    // Send the ID token to your server
    const response = await apiClient.post('/auth/google', {
      idToken: userInfo.idToken,
    });

    // Save the token from your server
    await AsyncStorage.setItem('token', response.data.token);

    return response.data;
  } catch (error) {
    throw error;
  }
};
