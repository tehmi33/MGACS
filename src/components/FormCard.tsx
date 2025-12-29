import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function FormCard({
  title = 'Visitor Request',
  subtitle = 'Fill in the details below',
  children,
}: Props) {
  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.accent} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      {/* BODY */}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
   backgroundColor: '#f8fafc',
    // borderRadius: 18,
    // borderWidth: 1,
    // borderColor: '#e5e7eb',
    // shadowColor: '#000',
    // shadowOpacity: 0.08,
    // shadowRadius: 14,
    // shadowOffset: { width: 0, height: 6 },
    // elevation: 5,
    // maxWidth: 420,
    // alignSelf: 'center',
    // width: '100%',
    // overflow: 'hidden',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },

  accent: {
    width: 4,
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#6366f1', // indigo accent
    marginRight: 12,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },

  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },

  body: {
    padding: 16,
  },
});
