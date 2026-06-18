import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, radius, typography } from '../../constants/theme'

const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

export default function AgentDone() {
  const router = useRouter()
  const { amount } = useLocalSearchParams()

  const numAmount = Number(amount)
  const deliveryFee = 2000
  const refundAmount = numAmount

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/agent/home')
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.screen}>
      <View style={styles.container}>

        {/* Success Icon */}
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={52} color="#FFFFFF" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Delivery Complete!</Text>
        <Text style={styles.subtitle}>
          Great job! Cash has been successfully{'\n'}handed over to the customer.
        </Text>

        {/* Receipt Card */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Cash Delivered</Text>
            <Text style={styles.receiptValue}>{formatTSH(numAmount)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Refund Due to You</Text>
            <Text style={[styles.receiptValue, { color: colors.success }]}>
              {formatTSH(refundAmount)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Your Delivery Fee</Text>
            <Text style={[styles.receiptValue, { color: colors.success }]}>
              +{formatTSH(deliveryFee)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Total Coming to You</Text>
            <Text style={[styles.receiptValue, { fontSize: 16 }]}>
              {formatTSH(refundAmount + deliveryFee)}
            </Text>
          </View>
        </View>

        {/* Refund Note */}
        <View style={styles.refundNote}>
          <Ionicons name="information-circle-outline" size={14} color={colors.mutedForeground} />
          <Text style={styles.refundNoteText}>
            Your refund of {formatTSH(refundAmount + deliveryFee)} will be sent to your mobile money within 24 hours
          </Text>
        </View>

        <Text style={styles.redirectNote}>Returning to dashboard...</Text>

        {/* Home Button */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace('/agent/home')}
        >
          <Ionicons name="home-outline" size={18} color={colors.primaryForeground} />
          <Text style={styles.homeText}>Back to Dashboard</Text>
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  successIcon: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
  },
  title: {
    ...typography.heading1,
    color: colors.foreground,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 24,
  },
  receiptCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    gap: spacing.md,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: 14, color: colors.mutedForeground,
  },
  receiptValue: {
    fontSize: 14, fontWeight: '700', color: colors.foreground,
  },
  divider: {
    height: 1, backgroundColor: colors.border,
  },
  refundNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: '#F0FDF4',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    width: '100%',
  },
  refundNoteText: {
    fontSize: 12, color: colors.mutedForeground, flex: 1, lineHeight: 18,
  },
  redirectNote: {
    fontSize: 13, color: colors.mutedForeground, textAlign: 'center',
  },
  homeButton: {
    height: 52, borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, width: '100%',
  },
  homeText: {
    fontSize: 16, fontWeight: '600', color: colors.primaryForeground,
  },
})