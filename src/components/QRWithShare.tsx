import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Clipboard,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import ViewShot, { captureRef } from "react-native-view-shot";
import Share from "react-native-share";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from '../theme/ThemeContext';
import { AppStyles } from '../styles/AppStyles';
import { Theme } from '../theme/themes';

type Props = {
  value: string | number;
  size?: number;
};

export default function TinyQRCodeCard({ value, size = 38 }: Props) {
   const theme = useTheme();
    const appstyles = AppStyles(theme);
    const styles = createStyles(theme);
  const ref = useRef<ViewShot>(null);

  const shareQR = async () => {
    try {
      if (!ref.current) return;

      const uri = await captureRef(ref.current, {
        format: "png",
        quality: 1,
      });

      await Share.open({
        url: uri,
        type: "image/png",
        failOnCancel: true,
      });
    } catch (e: any) {
      if (e?.message?.includes("User did not share")) return;
      Alert.alert("Error", "Unable to share QR");
    }
  };

  const copyCode = () => {
    Clipboard.setString(String(value));
    Alert.alert("Copied", "Code copied to clipboard");
  };

  return (
    <View style={styles.card}>
      <View style={styles.actions}>
        <Pressable hitSlop={8} onPress={copyCode}>
          <Icon name="content-copy" size={14} color={theme.colors.info} />
        </Pressable>

        <Pressable hitSlop={8} onPress={shareQR}>
          <Icon name="share-variant" size={14} color={theme.colors.info} />
        </Pressable>
      </View>

      <ViewShot ref={ref}>
        <View style={styles.qrWrapper}>
          <QRCode
            value={String(value)}
            size={size}
            color={theme.colors.text}
            backgroundColor={theme.colors.white}
          />
        </View>
      </ViewShot>

      <Text style={[appstyles.mutedText,styles.code]}>{value}</Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
  card: {
    backgroundColor:theme.colors.softCardBg,
    borderRadius: 10,
    padding: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: "30%",
  },

  actions: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  qrWrapper: {
    backgroundColor: theme.colors.white,
    padding: 4,
  },

  code: {
    marginTop: 4,
    // fontSize: 9,
    fontWeight: "600",
  },
});
