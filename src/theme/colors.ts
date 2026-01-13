export const LightColors = {
  primary: '#1E40AF',
  primaryMid: '#2563EB',
  primaryLight: '#739CFF',

  screenBg: '#EEF2FF',
  cardBg: '#FFFFFF',
  softCardBg: '#F8FAFC',

  title: '#1E40AF',
  text: '#000000',
  muted: '#64748B',
  placeholder: '#9E9E9E',
  error: 'red',
  white: '#FFFFFF',
  header: '#fff',
  border: '#E0E0E0',
  success: '#22C55E',

  info: '#2563EB',
  warning: '#F59E0B',
  danger: '#EF4444',

  successLight: '#DCFCE7',
  warningLight: '#FEF3C7',
  infoLight: '#DBEAFE',
};

export const DarkColors: typeof LightColors = {
  primary: '#739CFF',
  primaryMid: '#4DA3FF',
  primaryLight: '#A5B4FC',

  screenBg: '#0F172A',
  cardBg: '#020617',
  softCardBg: '#020617',

  title: '#E5EDFF',
  text: '#FFFFFF',
  muted: '#94A3B8',
  placeholder: '#64748B',
  error: '#F87171',
  white: '#FFFFFF',
header: '#1E40AF',
  border: '#1E293B',
  success: '#4ADE80',

  info: '#60A5FA',
  warning: '#FBBF24',
  danger: '#F87171',

  successLight: '#064E3B',
  warningLight: '#78350F',
  infoLight: '#1E3A8A',
};

export type ThemeColors = typeof LightColors;
