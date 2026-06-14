import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native'
import { colors, radius, spacing, typography } from '../../constants/theme'

type InputProps = TextInputProps & {
  label?: string
  error?: string
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={colors.mutedForeground}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.small,
    fontWeight: '500',
    color: colors.foreground,
  },
  input: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.foreground,
    backgroundColor: colors.card,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    ...typography.tiny,
    color: colors.error,
  },
})