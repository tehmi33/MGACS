import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import BiometricEnableModal from "../../components/BiometricEnableModal";
import { deviceHasBiometricSupport } from "../../utils/biometricAuth";
import { useNavigation } from "@react-navigation/native";


const HomeScreen: React.FC = () => {
  const navigation=useNavigation();
  const { user, logout, enableBiometricLogin, biometricEnabled , untrustAllDevices} = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);
  const [promptShownThisSession, setPromptShownThisSession] = useState(false);

  /* -------------------------------------------------------
     SHOW BIOMETRIC ENABLE PROMPT ON LOGIN (ONCE PER SESSION)
     Conditions:
     - User is logged in
     - Biometric login not already enabled
     - Device supports biometrics
     - Modal has not been shown yet this session
  ------------------------------------------------------- */
  useEffect(() => {
    const maybeShowPrompt = async () => {
      if (!user) return;                       // not logged in
      if (biometricEnabled) return;            // already enabled
      if (promptShownThisSession) return;      // already shown this session

      const supported = await deviceHasBiometricSupport();
      if (!supported) return;                  // device doesn't support biometric

      setShowModal(true);
      setPromptShownThisSession(true);
    };

    maybeShowPrompt();
  }, [user, biometricEnabled]);

  /* -------------------------------------------------------
     USER ENABLES BIOMETRIC
  ------------------------------------------------------- */
  const handleEnable = async () => {
    const ok = await enableBiometricLogin();
    setShowModal(false);
  };

  /* -------------------------------------------------------
     USER SKIPS
  ------------------------------------------------------- */
  const handleSkip = () => {
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Home!</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutBtn} onPress={untrustAllDevices}>
        <Text style={styles.logoutText}>Untrusted</Text>
      </TouchableOpacity>
       <TouchableOpacity style={styles.logoutBtn} onPress={()=>{navigation.navigate("VisitorRequestScreen")}}>
        <Text style={styles.logoutText}>formhook</Text>
      </TouchableOpacity>

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
