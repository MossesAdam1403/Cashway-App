import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Navigation from '../components/cashway/navigation'
import { colors, spacing, radius, typography } from '../constants/theme'

export default function OTPVerification() {
  const router = useRouter()
  const { amount, agentName, total } = useLocalSearchParams()
  const [status, setStatus] = useState<'sending' | 'waiting' | 'confirmed' | 'error'>('sending')

  const requestOTP = async () => {
    setStatus('sending')
    try {
      // TODO: call backend to generate and send OTP to customer phone
      // const response = await fetch('https://cashway-app.onrender.com/api/otp/generate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ amount, agentName })
      // })
      // const data = await response.json()
      // if (data.success) setStatus('waiting')

      // Simulate backend sending OTP
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStatus('waiting')

      // TODO: listen for agent confirmation via backend polling or websocket
      // backend will confirm when agent enters correct OTP on their device
      // socket.on('otp_confirmed', () => {
      //   setStatus('confirmed')
      //   setTimeout(() => router.push({ pathname: '/rating', params: { amount, agentName, total } }), 1500)
      // })

      // Simulate agent confirmation
      await new Promise(resolve => setTimeout(resolve, 8000))
      setStatus('confirmed')
      setTimeout(() => {
        router.push({
          pathname: '/rating',
          params: { amount, agentName, total }
        })
      }, 1500)

    } catch (err) {
      setStatus('error')
    }
  }

  useEffect(() => {
    requestOTP()
  }, [])

  return (
    <View style={styles.screen}>
      <Navigation />

      <View style={styles.container}>

        {/* Sending OTP State */}
        {status === 'sending' && (
          <>
            <View style={styles.iconContainer}>
              <Ionicons name="paper-plane-outline" size={36} color={colors.foreground} />
            </View>
            <Text style={styles.title}>Sending your code...</Text>
            <Text style={styles.subtitle}>
              We are sending a verification code{'\n'}to your phone via SMS
            </Text>
            <ActivityIndicator color={colors.foreground} size="large" />
          </>
        )}

        {/* Waiting State */}
        {status === 'waiting' && (
          <>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark-outline" size={36} color={colors.foreground} />
            </View>
            <Text style={styles.title}>Cash is almost yours!</Text>
            <Text style={styles.subtitle}>
              Check your SMS and read the{'\n'}code to your agent
            </Text>

            {/* Instruction Card */}
            <View style={styles.instructionCard}>
              <View style={styles.instructionStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>Check your SMS for the OTP code</Text>
              </View>
              <View style={styles.instructionStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>Read the code out loud to your agent</Text>
              </View>
              <View style={styles.instructionStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>Agent enters it to confirm handover</Text>
              </View>
            </View>

            {/* Waiting Indicator */}
            <View style={styles.waitingContainer}>
              <ActivityIndicator color={colors.foreground} size="small" />
              <Text style={styles.waitingText}>
                Waiting for agent to confirm...
              </Text>
            </View>

            {/* Amount Pill */}
            <View style={styles.amountPill}>
              <Ionicons name="cash-outline" size={14} color={colors.mutedForeground} />
              <Text style={styles.amountText}>
                Collecting {`TSH ${Number(amount).toLocaleString()}`}
              </Text>
            </View>
          </>
        )}

        {/* Confirmed State */}
        {status === 'confirmed' && (
          <>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={40} color={colors.primaryForeground} />
            </View>
            <Text style={styles.title}>Cash Delivered!</Text>
            <Text style={styles.subtitle}>
              Your cash has been successfully{'\n'}handed over. Enjoy!
            </Text>
          </>
        )}

        {/* Error State */}
        {status === 'error' && (
          <>
            <View style={styles.errorIcon}>
              <Ionicons name="alert-circle" size={40} color={colors.error} />
            </View>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
              We could not send your OTP.{'\n'}Please try again.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={requestOTP}>
              <Ionicons name="refresh-outline" size={18} color={colors.primaryForeground} />
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </>
        )}

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.heading2,
    color: colors.foreground,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 24,
  },
  instructionCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    gap: spacing.md,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryForeground,
  },
  stepText: {
    fontSize: 14,
    color: colors.foreground,
    flex: 1,
    lineHeight: 20,
  },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  waitingText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  amountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    width: '100%',
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
})