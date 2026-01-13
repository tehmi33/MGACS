import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { BackgroundThemes } from '../theme/background';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  children: React.ReactNode;
};

export default function AppBackground({ children }: Props) {
  const theme = useTheme();

  // Decide background automatically
  const bg =
    theme.mode === 'dark'
      ? BackgroundThemes.dark
      : BackgroundThemes.light;

  if (bg.type === 'solid') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg.color }}>
        {children}
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={bg.colors!}
      start={bg.start ?? { x: 0.5, y: 0 }}
      end={bg.end ?? { x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}
