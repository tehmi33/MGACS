import axios from "axios";
import DeviceInfo from "react-native-device-info";
import { getCachedFcmToken } from "../utils/fcmToken";

export const API_URL = "http://182.180.48.227:83/api/host";
// export const API_URL = "http://192.168.1.201:83/api/host";
let AUTH_TOKEN: string | null = null; // in-memory token

export const setAxiosToken = (token: string | null) => {
  AUTH_TOKEN = token;
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

// ---------- REQUEST INTERCEPTOR ----------
api.interceptors.request.use(async (config) => {
  const deviceId = await DeviceInfo.getUniqueId();
  const deviceModel = DeviceInfo.getModel();
  const fcmToken = getCachedFcmToken();

  // ✅ Ensure headers object exists
  config.headers = config.headers ?? {};

  

  // ✅ Attach Authorization ONLY if token exists
  if (AUTH_TOKEN) {
    config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
  }

  // ✅ Attach device id
  config.headers["X-DEVICE-ID"] = deviceId;

  // ✅ Attach FCM token if available
  if (fcmToken) {
    config.headers["X-FCM-TOKEN"] = fcmToken;
  }
  


  // Debug logging
  if (__DEV__) {
    console.log("📤 API REQUEST:");
    console.log("➡ URL:", `${config.baseURL}${config.url}`);
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
      console.log("⬅ URL:", `${response.config.baseURL}${response.config.url}`);
      console.log("⬅ STATUS:", response.status);
      console.log("⬅ DATA:", response.data);
    }
    return response;
  },
  (error) => {
    if (__DEV__) {
      console.log("❌ API ERROR RESPONSE:");
      console.log("⬅ URL:", `${error?.config?.baseURL}${error?.config?.url}`);
      console.log("⬅ STATUS:", error?.response?.status);
      console.log("⬅ ERROR DATA:", error?.response?.data);
      console.log("⬅ MESSAGE:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
