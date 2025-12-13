import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api , { setAxiosToken }from "../api/client";
import { User, LoginResponse, VerifyOtpResponse } from "../types/auth";
import DeviceInfo from "react-native-device-info";
import { ApiResponse } from "../types/api";
import { parseApiError } from "../utils/apiError";

import {
  saveTokenWithBiometric,
  deleteTokenFromBiometric,
  authenticateBiometric,
  deviceHasBiometricSupport,
  tokenExistsInBiometric,
} from "../utils/biometricAuth";
import { getCachedFcmToken } from "../utils/fcmToken";

/* -------------------------------------------------------
   AUTH CONTEXT INTERFACE
------------------------------------------------------- */
interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<ApiResponse<LoginResponse>>;
  verifyOtp: (phone: string, otp: string) => Promise<ApiResponse<VerifyOtpResponse>>;
  logout: () => Promise<void>;
  enableBiometricLogin: () => Promise<boolean>;
  biometricEnabled: boolean;
  untrustAllDevices: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: false,
  login: async () => ({ success: false, code: "NOT_IMPLEMENTED", message: "", data: null }),
  verifyOtp: async () => ({ success: false, code: "NOT_IMPLEMENTED", message: "", data: null }),
  logout: async () => {},
  enableBiometricLogin: async () => false,
  biometricEnabled: false,
  untrustAllDevices: async () => false,
});

/* -------------------------------------------------------
   AUTH PROVIDER
------------------------------------------------------- */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // VERY IMPORTANT: session token stays ONLY in memory.
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  /* -------------------------------------------------------
     LOAD BIOMETRIC FLAG ON STARTUP
  ------------------------------------------------------- */
  useEffect(() => {
    (async () => {
      const flag = await AsyncStorage.getItem("biometricEnabled");
      setBiometricEnabled(flag === "1");
    })();
  }, []);

  /* -------------------------------------------------------
     RESTORE SESSION ON APP START
     Logic:
     - If biometric enabled → prompt biometric → restore token
     - If not enabled → user must login manually
  ------------------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        if (!biometricEnabled) {
          setLoading(false);
          return;
        }

        const storedBioToken = await tokenExistsInBiometric();
        if (!storedBioToken) {
          setLoading(false);
          return;
        }

        const unlockedToken = await authenticateBiometric();
        if (unlockedToken) {
          // Restore session in memory
          setSessionToken(unlockedToken);
           setAxiosToken(unlockedToken);

          try {
            const res = await api.get("/auth/user", {
              headers: { Authorization: `Bearer ${unlockedToken}` },
            });
            setUser(res.data);

            updateFcmToken(unlockedToken);
          } catch {
            setSessionToken(null);
          }
        }

      } catch (err) {
        console.log("Startup biometric restore error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [biometricEnabled]);

  const updateFcmToken = async (existintSessionToken?: string) => {
    const tokenToUse = existintSessionToken ?? sessionToken;
    const fcm = getCachedFcmToken();
    console.log('Session token: '+tokenToUse);
    console.log('FCM token: '+fcm);
    if (!tokenToUse || !fcm) return;

    try {
      const device_id = await DeviceInfo.getUniqueId();

      await api.post(
        "/auth/update-fcm-token",
        { device_id, fcm_token: fcm },
        { headers: { Authorization: `Bearer ${sessionToken}` } }
      );

      console.log("FCM updated on server:", fcm);

    } catch (err) {
      console.log("Failed FCM update:", err);
    }
  };

  // expose to App.tsx for onTokenRefresh
  globalThis.updateFcmOnRefresh = updateFcmToken;

  /* -------------------------------------------------------
     LOGIN WITH CREDENTIALS
  ------------------------------------------------------- */
  const login = async (phone_no: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    try {
      const res = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
        phone_no,
        password,
      });

      if (res.data.success && res.data.data?.token) {
        // Store token only in memory
        setSessionToken(res.data.data.token);
        setAxiosToken(res.data.data.token);
        setUser(res.data.data.user ?? null);

        updateFcmToken(res.data.data.token);
      }

      return res.data;

    } catch (err: any) {
      return parseApiError(err);
    }
  };

  /* -------------------------------------------------------
     VERIFY OTP
     - DOES NOT auto-enable biometric
     - ONLY sets in-memory session
  ------------------------------------------------------- */
  const verifyOtp = async (phone_no: string, otp: string): Promise<ApiResponse<VerifyOtpResponse>> => {
    try {
      const device_id = await DeviceInfo.getUniqueId();
      const res = await api.post<ApiResponse<VerifyOtpResponse>>(
        "/auth/verify-otp",
        { phone_no, otp, device_id }
      );

      if (res.data.success && res.data.data?.token) {
        setSessionToken(res.data.data.token);
        setAxiosToken(res.data.data.token);
        setUser(res.data.data.user ?? null);

        updateFcmToken(res.data.data.token);
      }

      return res.data;

    } catch (err: any) {
      return parseApiError(err);
    }
  };

  /* -------------------------------------------------------
     ENABLE BIOMETRIC LOGIN
     - Save token to secure storage
     - Save biometricEnabled flag
  ------------------------------------------------------- */
  const enableBiometricLogin = async (): Promise<boolean> => {
    if (!sessionToken) return false;

    const supported = await deviceHasBiometricSupport();
    if (!supported) return false;

    try {
      await saveTokenWithBiometric(sessionToken);
      await AsyncStorage.setItem("biometricEnabled", "1");
      setBiometricEnabled(true);

      return true;

    } catch (err) {
      console.log("Failed to enable biometric:", err);
      return false;
    }
  };

  /* -------------------------------------------------------
     LOGOUT
     - Clear in-memory token
     - Clear user
     - Clear secure token
     - Keep biometricEnabled=false
  ------------------------------------------------------- */
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { headers: { Authorization: `Bearer ${sessionToken}` } });
    } catch {}

    setSessionToken(null);
    setAxiosToken(null);
    setUser(null);

    await deleteTokenFromBiometric();
    await AsyncStorage.removeItem("biometricEnabled");
    setBiometricEnabled(false);
  };

  /* -------------------------------------------------------
   UNTRUST ALL DEVICES
  ------------------------------------------------------- */
  const untrustAllDevices = async (): Promise<boolean> => {
    try {
      await api.post(
        "/auth/untrust-devices",
        {},
        { headers: { Authorization: `Bearer ${sessionToken}` } }
      );
      return true;
    } catch (err) {
      console.log("Untrust devices error:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        verifyOtp,
        logout,
        enableBiometricLogin,
        biometricEnabled,
        untrustAllDevices,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
