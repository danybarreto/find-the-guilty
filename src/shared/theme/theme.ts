export const colors = {
  background: '#0a0a0a', // Deep black
  surface: '#171717',    // Slightly lighter black for cards/panels
  primary: '#F5F5DC',    // Bone white
  accent: '#8A0303',     // Blood red
  accentSecondary: '#B8860B', // Dark yellow/ochre
  text: '#E5E5E5',       // Off-white
  textMuted: '#737373',  // Gray
  border: '#333333',     // Dark gray for borders
  success: '#166534',
  error: '#991b1b',
};

export const typography = {
  fontFamily: 'System', // Can be customized if they load a custom font later
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    giant: 48,
  },
  weights: {
    regular: '400' as const,
    bold: '700' as const,
    black: '900' as const, // Brutalist bold
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
