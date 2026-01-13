import { LightColors, DarkColors, ThemeColors } from './colors';
import { LightGradients, DarkGradients } from './gradients';

export interface Theme {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  gradients: {
    primary: string[];
    success: string[];
    warning: string[];
  };
}

export const lightTheme: Theme = {
  mode: 'light',
  colors: LightColors,
  gradients: LightGradients,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: DarkColors,
  gradients: DarkGradients,
};
