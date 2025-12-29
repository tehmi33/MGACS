import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TinyQRCodeCard from "../components/QRWithShare";

type Status = "pending" | "approved";

type Props = {
  primaryMember: string;
  visitorsCount: number;
  vehiclesCount: number;
  startDateTime: string;
  endDateTime: string;
  status: Status;
  onPress?: () => void;
};

const STATUS_CONFIG: Record<Status, any> = {
  pending: {
    text: "Pending",
    bar: "#DC2626",
    badgeBg: "#FEE2E2",
    badgeText: "#B91C1C",
    glow: "#FCA5A5",
    icon: "clock-outline",
    iconColor: "#DC2626",
  },
  approved: {
    text: "Approved",
    bar: "#16A34A",
    badgeBg: "#DCFCE7",
    badgeText: "#166534",
    glow: "#86EFAC",
    icon: "check-circle-outline",
    iconColor: "#16A34A",
  },
};

const VisitorEntryCard = ({
  primaryMember,
  visitorsCount,
  vehiclesCount,
  startDateTime,
  endDateTime,
  status,
  onPress,
}: Props) => {
  const isExpired = status === "approved";
  const config = STATUS_CONFIG[status];

  const DEFAULT_QR_VALUE = 987654321;

  return (
    <Pressable style={styles.wrapper} onPress={onPress}>
      {/* Accent Bar */}
      <View style={[styles.statusBar, { backgroundColor: config.bar }]} />

      {/* Card */}
      <View style={[styles.card, { shadowColor: config.glow }]}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Icon name="account" size={23} color={config.iconColor} />
            <Text style={styles.title}>{primaryMember}</Text>
          </View>

          <View style={[styles.badge, { backgroundColor: config.badgeBg }]}>
            <Icon name={config.icon} size={14} color={config.badgeText} />
            <Text style={[styles.badgeText, { color: config.badgeText }]}>
              {config.text}
            </Text>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.infoRow}>
          <MiniStat
            icon="account-group-outline"
            label="Visitors"
            value={visitorsCount}
            color={config.iconColor}
          />
          <MiniStat
            icon="car-outline"
            label="Vehicles"
            value={vehiclesCount}
            color={config.iconColor}
          />
          {status === "approved" && (
          <TinyQRCodeCard value={987654321}  />
          )}
        </View>

      
        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.dateText}>
            {formatDate(startDateTime)}
          </Text>

          <View style={styles.expiryRow}>
            <Icon
              name={isExpired ? "clock-alert-outline" : "timer-sand"}
              size={14}
              color={config.iconColor}
            />
            <Text style={[styles.statusText, { color: config.iconColor }]}>
              {isExpired
                ? "Not Checked In"
                : `Expires ${formatTime(endDateTime)}`}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const MiniStat = ({ icon, label, value, color }: any) => (
  <View style={styles.miniCard}>
    <View style={[styles.miniIcon, { backgroundColor: `${color}20` }]}>
      <Icon name={icon} size={18} color={color} />
    </View>
    <Text style={styles.miniValue}>{value}</Text>
    <Text style={styles.miniLabel}>{label}</Text>
  </View>
);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default memo(VisitorEntryCard);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 10,
  },
  statusBar: {
    width: 10,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    padding: 16,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    marginTop: 14,
  },
  miniCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 12,
    alignItems: "center",
    minWidth: 90,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  miniIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  miniValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginTop: 4,
  },
  miniLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 2,
  },
  qrSection: {
    marginTop: 16,
    alignItems: "flex-start",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  expiryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "800",
  },
});
