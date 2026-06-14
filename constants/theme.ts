export const colors = {
  background: '#FCFCFC',
  foreground: '#141414',
  card: '#FFFFFF',
  primary: '#1A1A1A',
  primaryForeground: '#FFFFFF',
  muted: '#F5F5F5',
  mutedForeground: '#737373',
  border: '#E6E6E6',
  success: '#3B9B6E',
  error: '#DC2626',
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
}

export const typography = {
  heading1: { fontSize: 30, fontWeight: '700' as const, letterSpacing: -0.5 },
  heading2: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.5 },
  heading3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  small: { fontSize: 14, fontWeight: '400' as const },
  tiny: { fontSize: 12, fontWeight: '400' as const },
}