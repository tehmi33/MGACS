import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface Props {
  children: React.ReactNode;
}

export default function VisitDetailsInformation({ children }: Props) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(prev => !prev);
  };

  return (
    <View style={styles.wrapper}>
      {/* CARD */}
      <View style={[styles.card, open && styles.cardOpen]}>
        {/* HEADER */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.header}
          onPress={toggle}
        >
          {/* LEFT ACCENT */}
          <View style={styles.accent} />

          {/* TITLE */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Visit Details Information</Text>
            <Text style={styles.subtitle}>
              {open
                ? 'Fill in the visitor details below'
                : 'Tap to add visit details'}
            </Text>
          </View>

          {/* ICON */}
          <Text
            style={[
              styles.icon,
              { transform: [{ rotate: open ? '180deg' : '0deg' }] },
            ]}
          >
            ⌄
          </Text>
        </TouchableOpacity>

        {/* BODY */}
        {open && <View style={styles.body}>{children}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    overflow: 'hidden',
  },

  cardOpen: {
    borderColor: '#6366f1',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#f8fafc',
  },

  accent: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#6366f1',
    marginRight: 12,
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },

  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },

  icon: {
    fontSize: 22,
    color: '#6366f1',
  },

  body: {
    padding: 18,
    backgroundColor: '#ffffff',
  },
});
