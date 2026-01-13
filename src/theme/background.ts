// src/theme/background.ts

export type SolidBackground = {
  type: 'solid';
  color: string;
};

export type GradientBackground = {
  type: 'gradient';
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
};

export type BackgroundTheme = SolidBackground | GradientBackground;

/**
 * App background themes
 * - Light mode  → solid color
 * - Dark mode   → gradient background
 */
export const BackgroundThemes: Record<'light' | 'dark', BackgroundTheme> = {
  light: {
    type: 'solid',
    color: '#EEF2FF',
  },

  dark: {
    type: 'gradient',
    colors: ['#5365b2ff', '#291280ff'],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
};

export type BackgroundThemeKey = keyof typeof BackgroundThemes;
