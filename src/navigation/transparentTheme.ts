import { DefaultTheme } from '@react-navigation/native';

export const TransparentNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};
