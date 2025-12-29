import React, { useRef } from "react";
import { View, Text, StyleSheet, Pressable, Alert, Clipboard } from "react-native";
import QRCode from "react-native-qrcode-svg";
import ViewShot, { captureRef } from "react-native-view-shot";
import Share from "react-native-share";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = {
  value: string | number;
  size?: number;
};

export default function TinyQRCodeCard({ value, size = 38 }: Props) {
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
    Clipboard.setString(String(value)); // ✅ no external lib
    Alert.alert("Copied", "Code copied to clipboard");
  };

  return (
    <View style={styles.card}>
      <View style={styles.actions}>
        <Pressable hitSlop={8} onPress={copyCode}>
          <Icon name="content-copy" size={14} color="#2563EB" />
        </Pressable>

        <Pressable hitSlop={8} onPress={shareQR}>
          <Icon name="share-variant" size={14} color="#2563EB" />
        </Pressable>
      </View>

      <ViewShot ref={ref}>
        <View style={styles.qrWrapper}>
          <QRCode
            value={String(value)}
            size={size}
            color="#111827"
            backgroundColor="#FFFFFF"
          />
        </View>
      </ViewShot>

      <Text style={styles.code}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: "27%",
  },
  actions: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  qrWrapper: {
    backgroundColor: "#FFFFFF",
    padding: 4,
    // borderRadius: 8,
  },
  code: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: "600",
    color: "#6B7280",
  },
});
