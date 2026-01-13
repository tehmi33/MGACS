import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import TinyQRCodeCard from '../components/QRWithShare';
import { useTheme } from '../theme/ThemeContext';
import { AppStyles } from '../styles/AppStyles';
import { Theme } from '../theme/themes';

/* ---------------- TYPES ---------------- */

type Status = 'pending' | 'approved';

type Props = {
  primaryMember: string;
  visitorsCount: number;
  vehiclesCount: number;
  startDateTime: string;
  endDateTime: string;
  statusName: string;
  statusColor?: string;
  QRcode: string;
  onPress?: () => void;
};

const VisitorEntryCard = ({
  primaryMember,
  visitorsCount,
  vehiclesCount,
  startDateTime,
  endDateTime,
  statusName,
  QRcode,
  onPress,
}: Props) => {
  const theme = useTheme();
  const appstyles = AppStyles(theme);
  const styles = createStyles(theme);

  const normalizedStatus = statusName?.toLowerCase() as Status;

  const STATUS_CONFIG: Record<Status, any> = {
    pending: {
      text: 'Pending',
      bar: theme.colors.warning,
      badgeBg: theme.colors.warningLight,
      badgeText: theme.colors.warning,
      icon: 'clock-outline',
      iconColor: theme.colors.warning,
    },
    approved: {
      text: 'Approved',
      bar: theme.colors.success,
      badgeBg: theme.colors.successLight,
      badgeText: theme.colors.success,
      icon: 'check-circle-outline',
      iconColor: theme.colors.success,
    },
  };

  const config =
    STATUS_CONFIG[normalizedStatus] ?? STATUS_CONFIG.pending;

  const isExpired = new Date(endDateTime).getTime() < Date.now();

  return (
    <Pressable style={styles.wrapper} onPress={onPress}>
      <View style={[styles.statusBar, { backgroundColor: config.bar }]} />

      <View style={[appstyles.card, styles.card]}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Icon name="account" size={22} color={config.iconColor} />
            <Text style={appstyles.heading}>{primaryMember}</Text>
          </View>

          <View
            style={[
              appstyles.badge,
              styles.badge,
              { backgroundColor: config.badgeBg },
            ]}
          >
            <Icon name={config.icon} size={14} color={config.badgeText} />
            <Text
              style={[
                appstyles.badgeText,
                { color: config.badgeText },
              ]}
            >
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
            theme={theme}
          />

          <MiniStat
            icon="car-outline"
            label="Vehicles"
            value={vehiclesCount}
            color={config.iconColor}
            theme={theme}
          />

          {normalizedStatus === 'approved' && !isExpired && (
            <TinyQRCodeCard value={QRcode} />
          )}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={appstyles.mutedText}>
            {formatDate(startDateTime)}
          </Text>

          <View style={styles.expiryRow}>
            <Icon
              name={isExpired ? 'clock-alert-outline' : 'timer-sand'}
              size={14}
              color={config.iconColor}
            />
            <Text
              style={[
                appstyles.badgeText,
                { color: config.iconColor },
              ]}
            >
              {isExpired
                ? 'Expired'
                : `Expires ${formatDate(endDateTime)} ${formatTime(
                    endDateTime
                  )}`}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

/* ---------------- MINI STAT ---------------- */

const MiniStat = ({
  icon,
  label,
  value,
  color,
  theme,
}: any) => {
  const appstyles = AppStyles(theme);
  const styles = createStyles(theme);

  return (
    <View style={styles.miniCard}>
      <View
        style={[
          styles.miniIcon,
          { backgroundColor: `${color}22` },
        ]}
      >
        <Icon name={icon} size={18} color={color} />
      </View>

      <Text style={styles.miniValue}>{value}</Text>
      <Text style={appstyles.mutedText}>{label}</Text>
    </View>
  );
};

/* ---------------- HELPERS ---------------- */

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

export default memo(VisitorEntryCard);

/* ---------------- STYLES ---------------- */

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {
      marginHorizontal: 10,
      marginVertical: 10,
      position: 'relative',
    },

    statusBar: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 10,
      height: '100%',
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      zIndex: 2,
    },

    card: {
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
    },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    badge: {
      paddingHorizontal: 12,
      paddingVertical: 5,
    },

    infoRow: {
      flexDirection: 'row',
      marginTop: 14,
      alignItems: 'center',
    },

    miniCard: {
      backgroundColor: theme.colors.softCardBg,
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 14,
      marginRight: 12,
      alignItems: 'center',
      minWidth: 90,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    miniIcon: {
      width: 28,
      height: 28,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },

    miniValue: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.colors.text,
      marginTop: 4,
    },

    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
    },

    expiryRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    // statusText: {
    //   marginLeft: 6,
    //   fontSize: 12,
    //   fontWeight: '700',
    // },
  });
