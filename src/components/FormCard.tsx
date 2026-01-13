import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AppStyles } from '../styles/AppStyles';
import { Theme } from '../theme/themes';

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
  const theme = useTheme();
  const appStyles = AppStyles(theme);
  const styles = createStyles(theme);

  return (
    <View>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.accent} />
        <View>
          <Text style={appStyles.screenTitle}>{title}</Text>
          <Text style={[appStyles.subtitle,{marginBottom: 0}]}>{subtitle}</Text>
        </View>
      </View>

      {/* BODY */}
      <View>{children}</View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
      padding: 10,
      backgroundColor: theme.colors.primaryLight + '11',
      borderRadius: 10,
    },
    accent: {
      width: 4,
      height: '100%',
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      marginRight: 12,
    },
  });
