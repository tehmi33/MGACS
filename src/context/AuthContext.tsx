import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { setAxiosToken } from "../api/client";
import { User, LoginResponse, VerifyOtpResponse } from "../types/auth";
import DeviceInfo from "react-native-device-info";
import { ApiResponse } from "../types/api";
import { parseApiError } from "../utils/apiError";
import { requestLocationPermission, getCurrentLocation, UserLocation } from "../utils/location";
// import RNBootSplash from "react-native-bootsplash";

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

/* -------------------------------------------------------
   AUTH CONTEXT INTERFACE
------------------------------------------------------- */
interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<ApiResponse<LoginResponse | null>>;
  verifyOtp: (phone: string, otp: string) => Promise<ApiResponse<VerifyOtpResponse | null>>;
  logout: () => Promise<void>;
  enableBiometricLogin: () => Promise<boolean>;
  biometricEnabled: boolean;
  untrustAllDevices: () => Promise<boolean>;
  resendOtp ?: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: false,
  login: async () => ({ success: false, code: "NOT_IMPLEMENTED", message: "", data: null }),
  verifyOtp: async () => ({ success: false, code: "NOT_IMPLEMENTED", message: "", data: null }),
  logout: async () => { },
  enableBiometricLogin: async () => false,
  biometricEnabled: false,
  untrustAllDevices: async () => false,
  resendOtp: async () => { },
});


export const getLocationForApi = async () => {
  // return null;
  try {
    const granted = await requestLocationPermission();
    if (!granted) return null;

    const location = await getCurrentLocation();
    return location; // { latitude, longitude, accuracy }
  } catch {
    return null;
  }
};
/* -------------------------------------------------------
   AUTH PROVIDER
------------------------------------------------------- */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // VERY IMPORTANT: session token stays ONLY in memory.
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // -------------------------------------------------------
  // LOCATION STATE + PROMISE CONTROLLER
  // -------------------------------------------------------
  const [locationReady, setLocationReady] = useState(false);
  const [location, setLocation] = useState<UserLocation | null>(null);

  // These will be assigned dynamically
  const locationPromiseRef = React.useRef<Promise<UserLocation | null> | null>(null);
  const resolveLocationPromiseRef = React.useRef<((loc: UserLocation | null) => void) | null>(null);


  /* -------------------------------------------------------
     LOAD BIOMETRIC FLAG ON STARTUP
  ------------------------------------------------------- */
  useEffect(() => {
    (async () => {
      const flag = await AsyncStorage.getItem("biometricEnabled");
      setBiometricEnabled(flag === "1");
    })();
  }, []);

 useEffect(() => {
  if (!user || loading) return;

  const interval = setInterval(() => {
    if (navigationRef.isReady()) {
      const pending = consumePendingNotification();
      if (pending) {
        handleNotification(pending, navigationRef, true);
      }
      clearInterval(interval);
    }
  }, 100);

  return () => clearInterval(interval);
}, [user, loading]);


  /* -------------------------------------------------------
   START LOCATION FETCH IN BACKGROUND ON APP START
------------------------------------------------------- */
  useEffect(() => {
  // Create a promise that login/otp/restore will await
  locationPromiseRef.current = new Promise((resolve) => {
    resolveLocationPromiseRef.current = resolve;
  });

  (async () => {
    try {
      const granted = await requestLocationPermission();
      if (!granted) {
        // Permission denied → resolve with null
        resolveLocationPromiseRef.current?.(null);
        setLocationReady(true);
        return;
      }

      console.log("Starting location fetch...");
      const loc = await getCurrentLocation(); // THIS actually fetches location & shows dialogs
      console.log("Location fetched:", loc);

      setLocation(loc);
      resolveLocationPromiseRef.current?.(loc);

    } catch (err) {
      console.log("Location fetch failed:", err);
      resolveLocationPromiseRef.current?.(null);
    } finally {
      setLocationReady(true);
      console.log("Setting location ready true in finally");
    }
  })();
}, []);

  /* -------------------------------------------------------
     RESTORE SESSION ON APP START
     Logic:
     - If biometric enabled → prompt biometric → restore token
     - If not enabled → user must login manually
  ------------------------------------------------------- */
  useEffect(() => {
  if (!locationReady) {
    console.log("Location not ready, delaying restore");
    return;
  }

  console.log("Location ready, proceeding with restore");

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

        // IMPORTANT FIX:
        const loc = await locationPromiseRef.current;
        console.log("Restoring user with location:", loc);

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

          if (loc) {
            console.log("API call completed with location:");
            console.log("Latitude:", loc.latitude);
            console.log("Longitude:", loc.longitude);
            console.log("Accuracy:", loc.accuracy);
          } else {
            console.log("API call completed without location");
          }

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
}, [biometricEnabled, locationReady]);


  const updateFcmToken = async (existingSessionToken?: string) => {
  const tokenToUse = existingSessionToken ?? sessionToken;
  const fcm = getCachedFcmToken();

  console.log("Session token:", tokenToUse);
  console.log("FCM token:", fcm);

  if (!tokenToUse || !fcm) return;

  try {
    await api.post(
      "/auth/update-fcm-token",
      {
       fcm_token: fcm, 
      },
      {
        headers: {
          Authorization: `Bearer ${tokenToUse}`, // ✅ CONFIG
        },
      }
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
  const login = async (
  mobile_no: string,
  password: string
): Promise<ApiResponse<LoginResponse | null>> => {
  try {
    // Wait for background location promise
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
  const verifyOtp = async (mobile_no: string, otp: string): Promise<ApiResponse<VerifyOtpResponse | null>> => {
    try {

      const res = await api.post<ApiResponse<VerifyOtpResponse>>(
        "/auth/verify-otp",

        {
          mobile_no,
          otp,
        }
      );

      if ( res.data.data?.token) {
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
    } catch { }

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
      "/auth/untrust-device",
      {
        device: "current",
      },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );return true;
  } catch (err) {
    console.log("Untrust current device error:", err);
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
        resendOtp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
