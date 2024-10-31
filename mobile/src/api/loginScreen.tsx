import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { login, verifyAuthCode } from "../api/auth";
import { signInWithGoogle } from "../api/googleAuth";
import { useRouter } from "next/router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [userId, setUserId] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { userId } = await login(email);
      setUserId(userId);
      setIsCodeSent(true);
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "An error occurred"
      );
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyAuthCode(userId, authCode);
      router.push("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Verification Failed",
        error.response?.data?.message || "An error occurred"
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      router.push("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Google Login Failed",
        "An error occurred during Google sign-in"
      );
    }
  };

  if (!isCodeSent) {
    return (
      <View>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Button title="Send Auth Code" onPress={handleLogin} />
        <Button title="Sign in with Google" onPress={handleGoogleLogin} />
      </View>
    );
  }

  return (
    <View>
      <TextInput
        placeholder="Enter 6-digit code"
        value={authCode}
        onChangeText={setAuthCode}
        keyboardType="number-pad"
        maxLength={6}
      />
      <Button title="Verify Code" onPress={handleVerifyCode} />
    </View>
  );
}
