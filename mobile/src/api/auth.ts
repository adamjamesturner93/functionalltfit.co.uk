import apiClient from "./client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const register = async (name: string, email: string) => {
  try {
    const response = await apiClient.post("/auth/register", { name, email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email: string) => {
  try {
    const response = await apiClient.post("/auth/login", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyAuthCode = async (userId: string, authCode: string) => {
  try {
    const response = await apiClient.post("/auth/verify", { userId, authCode });
    await AsyncStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await apiClient.post("/auth/logout");
    await AsyncStorage.removeItem("token");
  } catch (error) {
    throw error;
  }
};
