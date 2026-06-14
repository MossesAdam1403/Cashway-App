import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Navigation from '../components/cashway/navigation'
import { colors, spacing, radius, typography } from '../constants/theme'

const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

const detectProvider = (phone: string) => {
  if (phone.length < 4) return null
  const prefix = phone.substring(1, 3)
  if (['74', '75', '76'].includes(prefix)) return 'M-Pesa'
  if (['65', '67', '71'].includes(prefix)) return 'Mixx by Yas'
  if (['68', '69', '78'].includes(prefix)) return 'Airtel Money'
  if (['61', '62'].includes(prefix)) return 'HaloPesa'
  return 'Mobile Money'
}

export default function OrderSummary() {
  const router = useRouter()
  const { amount, lat, lng, agentName, agentPhone } = useLocalSearchParams()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const numAmount = Number(amount)
  const serviceFee = Math.round(numAmount * 0.05)
  const deliveryFee = 2000
  const total = numAmount + serviceFee + deliveryFee

  const provider = detectProvider(phone)
  const isReady = phone.length >= 10

  const handlePhoneChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '')
    if (digits.length <= 10) {
      setPhone(digits)
      setError('')
    }
  }

  const handleContinue = async () => {
    if (!isReady) return
    setLoading(true)
    setError('')

    try {
      // TODO: connect to backend payment push
      // const response = await fetch('https://cashway-app.onrender.com/api/payments/initiate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     amount: total,
      //     phone,
      //     provider,
      //     requestAmount: numAmount,
      //   })
      // })
      // const data = await response.json()

      // Simulate payment push for now
      await new Promise(resolve => setTimeout(resolve, 1500))

      router.push({
  pathname: '/quick-favour',
  params: { amount, phone, provider, total, agentName, agentPhone }
})

    } catch (err) {
      setError('Payment initiation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.screen}>
      <Navigation />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Back + Header */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color={colors.mutedForeground} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Select Payment Method</Text>
          <Text style={styles.pageSubtitle}>
            Fund your cash delivery of {formatTSH(numAmount)}
          </Text>
        </View>

        {/* Mobile Money Card */}
        <View style={[styles.card, isReady && styles.cardSelected]}>

          {/* Card Top Row */}
          <View style={styles.cardTop}>
            <View style={styles.providerIcon}>
              <Ionicons name="phone-portrait-outline" size={22} color={colors.primaryForeground} />
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerTitle}>Mobile Money</Text>
              <Text style={styles.providerSubtitle}>
                M-Pesa, Mixx by Yas, Airtel Money, HaloPesa
              </Text>
            </View>
            {isReady && (
              <Ionicons name="checkmark-circle" size={22} color={colors.success} />
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Phone Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 0712345678"
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="number-pad"
              maxLength={10}
              placeholderTextColor={colors.mutedForeground}
            />

            {/* Provider Detection */}
            {phone.length >= 4 && provider && (
              <View style={styles.detectedRow}>
                <Ionicons name="checkmark-circle-outline" size={13} color={colors.success} />
                <Text style={styles.detectedText}>
                  Detected: <Text style={styles.detectedProvider}>{provider}</Text>
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Fee Breakdown — only after phone entered */}
        {isReady && (
          <View style={styles.feeCard}>
            <Text style={styles.feeTitle}>Payment Summary</Text>

            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Requested Amount</Text>
              <Text style={styles.feeValue}>{formatTSH(numAmount)}</Text>
            </View>

            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Service Fee</Text>
              <Text style={styles.feeValue}>{formatTSH(serviceFee)}</Text>
            </View>

            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Delivery Fee</Text>
              <Text style={styles.feeValue}>{formatTSH(deliveryFee)}</Text>
            </View>

            <View style={styles.feeDivider} />

            <View style={styles.feeRow}>
              <Text style={styles.feeTotalLabel}>Total to Pay</Text>
              <Text style={styles.feeTotalValue}>{formatTSH(total)}</Text>
            </View>
          </View>
        )}

        {/* Error */}
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, !isReady && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!isReady || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} size="small" />
          ) : (
            <>
              <Ionicons name="flash" size={18} color={colors.primaryForeground} />
              <Text style={styles.continueText}>Continue to Pay</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark-outline" size={13} color={colors.mutedForeground} />
          <Text style={styles.securityText}>
            You will receive a payment prompt on your phone to confirm
          </Text>
        </View>

      </ScrollView>
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
  },
  content: {
    padding: spacing.md,
    paddingBottom: 80,
    gap: spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  backText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  pageHeader: {
    gap: spacing.xs,
  },
  pageTitle: {
    ...typography.heading2,
    color: colors.foreground,
  },
  pageSubtitle: {
    ...typography.small,
    color: colors.mutedForeground,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  cardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerInfo: {
    flex: 1,
    gap: 2,
  },
  providerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  providerSubtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  inputLabel: {
    fontSize: 14,
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
    backgroundColor: colors.background,
  },
  detectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4,
  },
  detectedText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  detectedProvider: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.foreground,
  },
  feeCard: {
    backgroundColor: colors.muted,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  feeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  feeValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  feeDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  feeTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.foreground,
  },
  feeTotalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.foreground,
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
    fontSize: 13,
    color: colors.error,
    flex: 1,
  },
  continueButton: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  continueButtonDisabled: {
    opacity: 0.4,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  securityText: {
    fontSize: 12,
    color: colors.mutedForeground,
    flex: 1,
    lineHeight: 18,
    textAlign: 'center',
  },
})