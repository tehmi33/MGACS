import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AppStyles } from '../styles/AppStyles';
import { Theme } from '../theme/themes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation();
  const theme = useTheme();
  const appStyles = AppStyles(theme);
  const styles = createStyles(theme);

  return (
    <View>
      {/* HEADER */}
      <View style={styles.header}>
        {/* BACK BUTTON */}
        <Pressable
          onPress={() => navigation?.goBack?.()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.7 },
          ]}
          android_ripple={{ color: theme.colors.primary + '22', borderless: true }}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={theme.colors.primary}
          />
        </Pressable>

        {/* ACCENT */}
        <View style={styles.accent} />

        {/* TITLES */}
        <View>
          <Text style={appStyles.screenTitle}>{title}</Text>
          <Text style={[appStyles.subtitle, { marginBottom: 0 }]}>
            {subtitle}
          </Text>
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
      backgroundColor: theme.colors.primaryLight + '22',
      borderRadius: 10,
      
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary + '15',
      marginRight: 10,
    },
    accent: {
      width: 4,
      height: '100%',
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      marginRight: 12,
    },
  });
