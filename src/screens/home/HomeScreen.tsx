import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  AppState,
  AppStateStatus,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import BiometricEnableModal from "../../components/BiometricEnableModal";
import { deviceHasBiometricSupport } from "../../utils/biometricAuth";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import {
  getCurrentLocation,
  requestLocationPermission,
} from "../../utils/location";

/* Adjust to your navigator */
type RootStackParamList = {
  VisitorRequestScreen: undefined;
  VisitorsInformation: undefined;

};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const auth = useContext(AuthContext);

  if (!auth) return null;

  const {
    user,
    logout,
    enableBiometricLogin,
    biometricEnabled,
    untrustAllDevices,
  } = auth;

  const [showModal, setShowModal] = useState(false);
  const [promptShownThisSession, setPromptShownThisSession] = useState(false);

  // 🔁 Used to retry location after returning from settings
  const shouldRetryLocation = useRef(false);

  /* -------------------------------------------------------
     FETCH LOCATION (GPS SAFE)
  ------------------------------------------------------- */
  const fetchLocation = useCallback(async () => {
  try {
    const location = await getCurrentLocation();

    // GPS OFF or permission blocked → user sent to settings
    if (!location) {
      shouldRetryLocation.current = true;
      return;
    }

    shouldRetryLocation.current = false;

    Alert.alert(
      "Location Fetched",
      `
Latitude: ${location.latitude}
Longitude: ${location.longitude}
Altitude: ${location.altitude ?? "N/A"}
Accuracy: ${location.accuracy} m
      `
    );

    console.log("User Location:", location);
  } catch (error: any) {
    Alert.alert("Error", error?.message || "Unable to fetch location");
  }
}, []);

  /* -------------------------------------------------------
     BIOMETRIC PROMPT (ONCE PER SESSION)
  ------------------------------------------------------- */
  useEffect(() => {
    const maybeShowPrompt = async () => {
      if (!user) return;
      if (biometricEnabled) return;
      if (promptShownThisSession) return;

      const supported = await deviceHasBiometricSupport();
      if (!supported) return;

      setShowModal(true);
      setPromptShownThisSession(true);
    };

    maybeShowPrompt();
  }, [user, biometricEnabled, promptShownThisSession]);

  const handleEnable = async () => {
    await enableBiometricLogin();
    setShowModal(false);
  };

  const handleSkip = () => setShowModal(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Home!</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={untrustAllDevices}>
        <Text style={styles.logoutText}>Untrust All Devices</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => navigation.navigate("VisitorRequestScreen")}
      >
        <Text style={styles.logoutText}>Form Hook</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => navigation.navigate("VisitorsInformation")}
      >
        <Text style={styles.logoutText}>Form</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.logoutBtn} onPress={fetchLocation}>
        <Text style={styles.logoutText}>Get Location</Text>
      </TouchableOpacity> */}

      <BiometricEnableModal
        visible={showModal}
        onEnable={handleEnable}
        onSkip={handleSkip}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30 },
  logoutBtn: {
    backgroundColor: "#F44336",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
