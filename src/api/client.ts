import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import { getCachedFcmToken } from "../utils/fcmToken";

export const API_URL = "https://malir-test.yns.com.pk/api/v1";


let AUTH_TOKEN: string | null = null; // 🔥 in-memory token for axios

export const setAxiosToken = (token: string | null) => {
  AUTH_TOKEN = token;
};
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// ---------- REQUEST INTERCEPTOR ----------
api.interceptors.request.use(async (config) => {
  // const token = await AsyncStorage.getItem("token");
  const deviceId = await DeviceInfo.getUniqueId();
  const fcmToken = getCachedFcmToken();

  // Attach token
  if (AUTH_TOKEN) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${AUTH_TOKEN}`,
    };
  }

  if (fcmToken) {
    config.headers["X-FCM-TOKEN"] = fcmToken;
  }

  // Attach device_id automatically
  config.data = {
    ...(config.data || {}),
    device_id: deviceId,
  };

  // Debug Logging
  if (__DEV__) {
    console.log("📤 API REQUEST:");
    console.log("➡ URL:", config.baseURL + config.url);
    console.log("➡ METHOD:", config.method?.toUpperCase());
    console.log("➡ HEADERS:", config.headers);
    console.log("➡ PAYLOAD:", config.data);
  }

  return config;
});

// ---------- RESPONSE INTERCEPTOR ----------
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log("📥 API RESPONSE:");
      console.log("⬅ URL:", response.config.baseURL + response.config.url);
      console.log("⬅ STATUS:", response.status);
      console.log("⬅ DATA:", response.data);
    }
    return response;
  },

  (error) => {
    if (__DEV__) {
      console.log("❌ API ERROR RESPONSE:");
      console.log("⬅ URL:", error?.config?.baseURL + error?.config?.url);
      console.log("⬅ STATUS:", error?.response?.status);
      console.log("⬅ ERROR DATA:", error?.response?.data);
      console.log("⬅ MESSAGE:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;