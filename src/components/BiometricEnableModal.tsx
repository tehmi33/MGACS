import React, { useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";

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
  const theme = useTheme();

  // Create styles using theme (memoized for performance
     const styles = createStyles(theme);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Enable Biometric Login?</Text>

          <Text style={styles.subtitle}>
            Use fingerprint or Face ID for quicker login next time.
          </Text>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.button, styles.enableBtn]}
              onPress={onEnable}
              activeOpacity={0.85}
            >
              <Text style={styles.enableText}>Enable</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.skipBtn]}
              onPress={onSkip}
              activeOpacity={0.85}
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

/* ===================== STYLES ===================== */

const createStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },

    container: {
      backgroundColor: theme.colors.cardBg,
      paddingVertical: 24,
      paddingHorizontal: 20,
      borderRadius: 16,
      width: "100%",
      maxWidth: 380,
      alignItems: "center",
      elevation: 6,
    },

    title: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.title,
      marginBottom: 8,
    },

    subtitle: {
      fontSize: 14,
      textAlign: "center",
      color: theme.colors.muted,
      marginBottom: 24,
    },

    buttonsRow: {
      flexDirection: "row",
      gap: 12,
      width: "100%",
    },

    button: {
      flex: 1,
      paddingVertical: 13,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },

    enableBtn: {
      backgroundColor: theme.colors.primary,
    },

    skipBtn: {
      backgroundColor: theme.colors.border,
    },

    enableText: {
      color: theme.colors.white,
      fontWeight: "700",
      fontSize: 15,
    },

    skipText: {
      color: theme.colors.text,
      fontWeight: "600",
      fontSize: 15,
    },
  });
