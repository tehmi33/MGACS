import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { setAxiosToken } from "../api/client";
import { User, LoginResponse, VerifyOtpResponse } from "../types/auth";
import { ApiResponse } from "../types/api";
import { parseApiError } from "../utils/apiError";
import { requestLocationPermission, getCurrentLocation, UserLocation } from "../utils/location";

import { consumePendingNotification } from '../ntifications/notificationsPending';
import { handleNotification } from '../ntifications/notifications';
import { navigationRef } from '../navigation/navigationRef';

import {
  saveTokenWithBiometric,
  deleteTokenFromBiometric,
  authenticateBiometric,
  deviceHasBiometricSupport,
  tokenExistsInBiometric,
} from "../utils/biometricAuth";
import { getCachedFcmToken } from "../utils/fcmToken";


interface AuthContextProps {
  user: User | null;
  firstName: string | null;
  setFirstName: (name: string) => void;
  loading: boolean;
  login: (phone: string, password: string) => Promise<ApiResponse<LoginResponse | null>>;
  register: (mobile_no: string, password: string, password_confirmation: string, name: string, cnic: string) => Promise<ApiResponse<LoginResponse | null>>;
  verifyOtp: (phone: string, otp: string) => Promise<ApiResponse<VerifyOtpResponse | null>>;
  logout: () => Promise<void>;
  enableBiometricLogin: () => Promise<boolean>;
  biometricEnabled: boolean;
  untrustAllDevices: () => Promise<boolean>;
  resendOtp ?: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  firstName: null,
  setFirstName: () => {},
  loading: false,
  login: async () => ({ success: false, code: "NOT_IMPLEMENTED", message: "", data: null }),
  register: async () => ({ success: false, code: "NOT_IMPLEMENTED", message: "", data: null }),
  verifyOtp: async () => ({ success: false, code: "NOT_IMPLEMENTED", message: "", data: null }),
  logout: async () => {},
  enableBiometricLogin: async () => false,
  biometricEnabled: false,
  untrustAllDevices: async () => false,
  resendOtp: async () => {},
});


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const [location, setLocation] = useState<UserLocation | null>(null);

  const locationPromiseRef = React.useRef<Promise<UserLocation | null> | null>(null);
  const resolveLocationPromiseRef = React.useRef<((loc: UserLocation | null) => void) | null>(null);


  // Load biometric flag
  useEffect(() => {
    (async () => {
      const flag = await AsyncStorage.getItem("biometricEnabled");
      setBiometricEnabled(flag === "1");
    })();
  }, []);


  // Location fetch promise
  useEffect(() => {
    locationPromiseRef.current = new Promise((resolve) => {
      resolveLocationPromiseRef.current = resolve;
    });

    (async () => {
      try {
        const granted = await requestLocationPermission();
        if (!granted) {
          resolveLocationPromiseRef.current?.(null);
          return;
        }

        const loc = await getCurrentLocation();
        setLocation(loc);
        resolveLocationPromiseRef.current?.(loc);
      } catch {
        resolveLocationPromiseRef.current?.(null);
      }
    })();
  }, []);


  // wait for location max 10 seconds
  const waitForLocationOrTimeout = async (timeoutMs: number) => {
    const locPromise = locationPromiseRef.current;
    if (!locPromise) return null;

    return Promise.race([
      locPromise,
      new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), timeoutMs)
      ),
    ]);
  };


  // Biometric restore (instant)
  useEffect(() => {
    (async () => {
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
      if (!unlockedToken) {
        setLoading(false);
        return;
      }

      setSessionToken(unlockedToken);
      setAxiosToken(unlockedToken);

      // 🟢 IMMEDIATE navigation
      setUser({ id: "temp", name: "Loading..." } as any);
      setLoading(false);

      // 🔁 fetch user in background
      const loc = await waitForLocationOrTimeout(10000);
      try {
        const res = await api.get("/auth/user", {
          headers: {
            Authorization: `Bearer ${unlockedToken}`,
            ...(loc && {
              "X-Latitude": loc.latitude,
              "X-Longitude": loc.longitude,
              "X-Accuracy": loc.accuracy,
            }),
          },
        });

        setUser(res.data);
        updateFcmToken(unlockedToken);
      } catch (err) {
        setUser(null);
        setSessionToken(null);
      }
    })();
  }, [biometricEnabled]);


  const updateFcmToken = async (existingSessionToken?: string) => {
    const tokenToUse = existingSessionToken ?? sessionToken;
    const fcm = getCachedFcmToken();
    if (!tokenToUse || !fcm) return;

    try {
      await api.post(
        "/auth/update-fcm-token",
        { fcm_token: fcm },
        { headers: { Authorization: `Bearer ${tokenToUse}` } }
      );
    } catch {}
  };

  globalThis.updateFcmOnRefresh = updateFcmToken;


  const login = async (mobile_no: string, password: string) => {
    try {
      const loc = await locationPromiseRef.current;

      const res = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
        mobile_no,
        password,
        ...(loc && {
          latitude: loc.latitude,
          longitude: loc.longitude,
          accuracy: loc.accuracy,
        }),
      });

      if (res.data.data?.token) {
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


  const register = async (
    mobile_no: string,
    password: string,
    password_confirmation: string,
    name?: string,
    cnic?: string
  ) => {
    try {
      const payload: any = { mobile_no, password, password_confirmation };
      if (name) payload.name = name;
      if (cnic) payload.cnic = cnic;

      const res = await api.post("/auth/register", payload);
      const apiUser = res.data.data.user;

      const firstName =
        typeof apiUser?.name === "string" && apiUser.name.trim()
          ? apiUser.name.trim().split(/\s+/)[0]
          : "User";

      setFirstName(firstName);

      if (res.data.data?.token) {
        setSessionToken(res.data.data.token);
        setAxiosToken(res.data.data.token);
      }

      return res.data;
    } catch (err: any) {
      return parseApiError(err);
    }
  };


  const verifyOtp = async (mobile_no: string, otp: string) => {
    try {
      const res = await api.post<ApiResponse<VerifyOtpResponse>>("/auth/verify-otp", { mobile_no, otp });

      if (res.data.data?.token) {
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


  const resendOtp = async () => {
    try {
      const res = await api.post('/auth/resend-otp');
      return res.data;
    } catch (err) {
      throw err;
    }
  };


  const enableBiometricLogin = async () => {
    if (!sessionToken) return false;

    const supported = await deviceHasBiometricSupport();
    if (!supported) return false;

    try {
      await saveTokenWithBiometric(sessionToken);
      await AsyncStorage.setItem("biometricEnabled", "1");
      setBiometricEnabled(true);
      return true;
    } catch (err) {
      return false;
    }
  };


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


  const untrustAllDevices = async () => {
    try {
      await api.post("/auth/untrust-device", { device: "current" }, {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      return true;
    } catch {
      return false;
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        firstName,
        setFirstName,
        loading,
        login,
        verifyOtp,
        logout,
        enableBiometricLogin,
        biometricEnabled,
        untrustAllDevices,
        resendOtp,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
