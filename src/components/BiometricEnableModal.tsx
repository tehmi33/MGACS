import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface BiometricEnableModalProps {
  visible: boolean;
  onEnable: () => void;
  onSkip: () => void;
}

const BiometricEnableModal: React.FC<BiometricEnableModalProps> = ({
  visible,
  onEnable,
  onSkip,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Enable Biometric Login?</Text>
          <Text style={styles.subtitle}>
            Use fingerprint or FaceID for quicker login next time.
          </Text>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.button, styles.enableBtn]}
              onPress={onEnable}
            >
              <Text style={styles.enableText}>Enable</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.skipBtn]}
              onPress={onSkip}
            >
              <Text style={styles.skipText}>Not Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BiometricEnableModal;


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: "white",
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 25,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  enableBtn: {
    backgroundColor: "#2B68F6",
  },
  skipBtn: {
    backgroundColor: "#E0E0E0",
  },
  enableText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  skipText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 15,
  },
});
