import { PermissionsAndroid, Platform, Alert } from "react-native";
import GetLocation from "react-native-get-location";

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  speed?: number;
}

/**
 * 🔁 Continuously retry until:
 * - Location permission granted
 * - Location services ON
 * - A valid location is received
 *
 * Shows a human-friendly alert if GPS is disabled.
 */
const waitForLocationEnabled = async (): Promise<UserLocation> => {
  while (true) {
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: false, // ❗ coarse location only
        timeout: 10000,
      });

      // ✅ Location is ready → return immediately
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        altitude: location.altitude,
      };

    } catch (error: any) {
      // 🔻 GPS OFF / UNAVAILABLE
      if (
        error?.code === "LOCATION_DISABLED" ||
        error?.code === "UNAVAILABLE"
      ) {
        await new Promise<void>((resolve) => {
          Alert.alert(
            "Location Disabled",
            "Please turn on your location to continue.",
            [{ text: "OK", onPress: resolve }],
            { cancelable: false }
          );
        });

        // 🕑 Avoid tight loop hammering GPS
        await new Promise(res => setTimeout(res, 500));
        continue;
      }

      // 🔻 Permission denied
      if (error?.code === "UNAUTHORIZED") {
        Alert.alert(
          "Permission Required",
          "Location permission is not granted."
        );
        throw error;
      }

      // 🔻 Unknown error
      throw error;
    }
  }
};

/**
 * 📍 Request only COARSE location permission
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, // using coarse only
      {
        title: "Location Permission",
        message: "Location access is required to continue.",
        buttonPositive: "OK",
        buttonNegative: "Cancel",
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  return true; // iOS handled automatically
};

/**
 * 🎯 Public function to fetch location
 * Handles blocking dialogs gracefully
 */
export const getCurrentLocation = async (): Promise<UserLocation | null> => {
  try {
    return await waitForLocationEnabled();
  } catch (err) {
    console.log("Fatal location error:", err);
    return null;
  }
};
