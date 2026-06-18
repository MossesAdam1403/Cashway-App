import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, radius, typography } from '../../constants/theme'
import AgentNavigation from '../../components/cashway/agent-navigation'

const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

export default function AgentOTP() {
  const router = useRouter()
  const { requestId, amount } = useLocalSearchParams()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setLoading(true)
    setError('')

    try {
      // TODO: connect to backend
      // const response = await fetch('https://cashway-app.onrender.com/api/otp/verify', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ requestId, otp })
      // })
      // const data = await response.json()
      // if (!data.success) {
      //   setError('Wrong code. Ask customer to check their SMS.')
      //   setLoading(false)
      //   return
      // }

      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500))

      router.replace({
        pathname: '/agent/done',
        params: { amount, requestId }
      })

    } catch (err) {
      setError('Verification failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <View style={styles.screen}>

      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="keypad-outline" size={36} color={colors.foreground} />
        <Text style={styles.title}>Enter Customer Code</Text>
        <Text style={styles.subtitle}>
          Ask the customer for their 6-digit OTP code and enter it below to confirm handover
        </Text>
      </View>

      <View style={styles.content}>

        {/* Amount Reminder */}
        <View style={styles.amountCard}>
          <Ionicons name="cash-outline" size={16} color={colors.mutedForeground} />
          <Text style={styles.amountText}>
            Handing over <Text style={styles.amountBold}>{formatTSH(Number(amount))}</Text>
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>6-Digit OTP Code</Text>
          <TextInput
            style={styles.otpInput}
            placeholder="000000"
            value={otp}
            onChangeText={(text) => {
              setOtp(text.replace(/[^0-9]/g, ''))
              setError('')
            }}
            keyboardType="number-pad"
            maxLength={6}
            placeholderTextColor={colors.mutedForeground}
          />
        </View>

        {/* Instructions */}
        <View style={styles.instructionCard}>
          <View style={styles.instructionStep}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>1</Text>
            </View>
            <Text style={styles.stepText}>Ask customer: "Please read me your OTP code"</Text>
          </View>
          <View style={styles.instructionStep}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>2</Text>
            </View>
            <Text style={styles.stepText}>Enter the code they read to you above</Text>
          </View>
          <View style={styles.instructionStep}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>3</Text>
            </View>
            <Text style={styles.stepText}>Hand over the cash after code is confirmed</Text>
          </View>
        </View>

        {/* Error */}
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.verifyButton, otp.length !== 6 && styles.verifyButtonDisabled]}
          onPress={handleVerify}
          disabled={otp.length !== 6 || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.primaryForeground} />
              <Text style={styles.verifyText}>Confirm & Hand Over Cash</Text>
            </>
          )}
        </TouchableOpacity>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.heading2,
    color: colors.foreground,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  amountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amountText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  amountBold: {
    fontWeight: '700',
    color: colors.foreground,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  otpInput: {
    height: 64,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: 32,
    fontWeight: '700',
    color: colors.foreground,
    backgroundColor: colors.card,
    textAlign: 'center',
    letterSpacing: 8,
  },
  instructionCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  stepDot: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  stepDotText: {
    fontSize: 12, fontWeight: '700', color: colors.primaryForeground,
  },
  stepText: {
    fontSize: 14, color: colors.foreground, flex: 1, lineHeight: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#FEF2F2',
    padding: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 13, color: colors.error, flex: 1,
  },
  verifyButton: {
    height: 52, borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm,
  },
  verifyButtonDisabled: { opacity: 0.4 },
  verifyText: {
    fontSize: 16, fontWeight: '600', color: colors.primaryForeground,
  },
})