import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState, useEffect, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import Navigation from '../components/cashway/navigation'
import { colors, spacing, radius, typography } from '../constants/theme'

export default function OTPVerification() {
  const router = useRouter()
  const { requestId, amount, agentName, total } = useLocalSearchParams()
  const [status, setStatus] = useState<'sending' | 'waiting' | 'confirmed' | 'error'>('sending')
  const [otpDigits, setOtpDigits] = useState<string[]>([])
  const [secondsLeft, setSecondsLeft] = useState(300)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const startCountdown = () => {
    setSecondsLeft(300)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          requestOTP()
          return 300
        }
        return prev - 1
      })
    }, 1000)
  }

  const startPollingForCompletion = async () => {
    const token = await SecureStore.getItemAsync('userToken')

    pollRef.current = setInterval(async () => {
      try {
        const response = await fetch(
          `https://cashway-app.onrender.com/api/requests/${requestId}/status`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        )
        const data = await response.json()

        if (data.status === 'completed') {
          if (pollRef.current) clearInterval(pollRef.current)
          if (timerRef.current) clearInterval(timerRef.current)
          setStatus('confirmed')
          setTimeout(() => {
            router.push({
              pathname: '/rating',
              params: { amount, agentName, total }
            })
          }, 1000)
        }
      } catch (err) {
        // Network hiccup — keep polling
      }
    }, 3000)
  }

  const requestOTP = async () => {
    setStatus('sending')
    if (pollRef.current) clearInterval(pollRef.current)

    try {
      const token = await SecureStore.getItemAsync('userToken')

      const response = await fetch(
        `https://cashway-app.onrender.com/api/requests/${requestId}/generate-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setStatus('error')
        return
      }

      setOtpDigits(data.otp.split(''))
      setStatus('waiting')
      startCountdown()
      startPollingForCompletion()

    } catch (err) {
      setStatus('error')
    }
  }

  useEffect(() => {
    requestOTP()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  return (
    <View style={styles.screen}>
      <Navigation />

      <View style={styles.container}>

        {/* Sending state */}
        {status === 'sending' && (
          <View style={styles.stateContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="paper-plane-outline" size={36} color={colors.foreground} />
            </View>
            <Text style={styles.title}>Generating your code...</Text>
            <ActivityIndicator color={colors.foreground} size="large" />
          </View>
        )}

        {/* Waiting state */}
        {status === 'waiting' && (
          <View style={styles.waitingLayout}>

            {/* Agent Info */}
            <View style={styles.agentCard}>
              <View style={styles.agentAvatar}>
                <Ionicons name="person" size={22} color={colors.foreground} />
              </View>
              <View style={styles.agentDetails}>
                <Text style={styles.agentName}>{agentName}</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="shield-checkmark" size={11} color={colors.mutedForeground} />
                  <Text style={styles.verifiedText}>Verified CashWay Agent</Text>
                </View>
              </View>
            </View>

            {/* Amount */}
            <Text style={styles.amount}>
              TSH {Number(amount).toLocaleString()}
            </Text>

            {/* OTP Card — separated with its own container */}
            <View style={styles.otpCard}>
              <Text style={styles.instruction}>Read this code to the agent</Text>

              <View style={styles.otpRow}>
                {otpDigits.map((digit, i) => (
                  <View key={i} style={styles.otpBox}>
                    <Text style={styles.otpDigit}>{digit}</Text>
                  </View>
                ))}
              </View>

              <Text style={[
                styles.countdown,
                secondsLeft <= 30 && styles.countdownWarning
              ]}>
                Expires in {formatTime(secondsLeft)}
              </Text>
            </View>

            {/* Waiting indicator */}
            <View style={styles.waitingIndicator}>
              <ActivityIndicator color={colors.foreground} size="small" />
              <Text style={styles.waitingText}>Waiting for agent to confirm...</Text>
            </View>

            {/* Cancel */}
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancel Transaction</Text>
            </TouchableOpacity>

          </View>
        )}

        {/* Confirmed state */}
        {status === 'confirmed' && (
          <View style={styles.stateContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={40} color={colors.primaryForeground} />
            </View>
            <Text style={styles.title}>Verification Successful</Text>
            <Text style={styles.subtitle}>Your cash has been delivered</Text>
          </View>
        )}

        {/* Error state */}
        {status === 'error' && (
          <View style={styles.stateContainer}>
            <View style={styles.errorIcon}>
              <Ionicons name="alert-circle" size={40} color={colors.error} />
            </View>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
              Could not generate your code.{'\n'}Please try again.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={requestOTP}>
              <Ionicons name="refresh-outline" size={18} color={colors.primaryForeground} />
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
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
  },
  stateContainer: {
    alignItems: 'center',
    gap: spacing.lg,
    width: '100%',
  },
  waitingLayout: {
    alignItems: 'center',
    gap: spacing.xl,
    width: '100%',
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
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  agentDetails: {
    flex: 1,
    gap: 4,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  amount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  otpCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
  },
  instruction: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontWeight: '500',
    textAlign: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
  },
  otpBox: {
    width: 48,
    height: 60,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpDigit: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.foreground,
  },
  countdown: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  countdownWarning: {
    color: colors.error,
  },
  waitingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  waitingText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  cancelButton: {
    height: 48,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.mutedForeground,
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


