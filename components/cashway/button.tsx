import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { colors, radius, typography } from '../../constants/theme'

type ButtonProps = {
  label: string
  onPress: () => void
  variant?: 'primary' | 'outline' | 'ghost'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

export function Button({ label, onPress, variant = 'primary', loading, disabled, fullWidth }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        (disabled || loading) && styles.disabled,
        fullWidth && styles.fullWidth,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : colors.primary} />
      ) : (
        <Text style={[
          styles.label,
          variant === 'primary' && styles.labelPrimary,
          variant === 'outline' && styles.labelOutline,
          variant === 'ghost' && styles.labelGhost,
        ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  labelPrimary: {
    color: colors.primaryForeground,
  },
  labelOutline: {
    color: colors.foreground,
  },
  labelGhost: {
    color: colors.mutedForeground,
  },
})