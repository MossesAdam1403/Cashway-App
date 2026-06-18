import { View, Text, StyleSheet, TouchableOpacity, Vibration } from 'react-native'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, radius, typography } from '../../constants/theme'
import AgentNavigation from '../../components/cashway/agent-navigation'

const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

export default function AgentRequest() {
  const router = useRouter()

  // Vibrate when request comes in
  useEffect(() => {
    Vibration.vibrate([0, 500, 200, 500])
  }, [])

  // TODO: get real request from backend notification
  const request = {
    id: 'req_123',
    amount: 25000,
    serviceFee: 1250,
    deliveryFee: 2000,
    totalToRefund: 25000,
    distance: '0.8 km',
    area: 'Kariakoo, Dar es Salaam',
    eta: '6 min',
    customerInitial: 'M',
    favour: 'Azam water 500ml',
  }

  const handleAccept = () => {
    router.replace({
      pathname: '/agent/navigation',
      params: { requestId: request.id, amount: request.amount, area: request.area }
    })
  }

  const handleDecline = () => {
    router.replace('/agent/home')
  }

  return (
    <View style={styles.screen}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.pulsingDot} />
        <Text style={styles.headerText}>New Cash Request</Text>
      </View>

      <View style={styles.content}>

        {/* Customer Info */}
        <View style={styles.customerCard}>
          <View style={styles.customerAvatar}>
            <Text style={styles.customerInitial}>{request.customerInitial}</Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerLabel}>Customer</Text>
            <Text style={styles.customerArea}>{request.area}</Text>
          </View>
          <View style={styles.distancePill}>
            <Ionicons name="location-outline" size={13} color={colors.mutedForeground} />
            <Text style={styles.distanceText}>{request.distance}</Text>
          </View>
        </View>

        {/* Request Details */}
        <View style={styles.detailRow}>
  <Text style={styles.detailLabel}>Cash to Deliver</Text>
  <Text style={styles.detailValue}>{formatTSH(request.amount)}</Text>
</View>
<View style={styles.divider} />
<View style={styles.detailRow}>
  <Text style={styles.detailLabel}>Total Customer Pays</Text>
  <Text style={[styles.detailValue, { color: colors.success }]}>
    {formatTSH(request.amount + Math.round(request.amount * 0.03) + 1500)}
  </Text>
</View>
<View style={styles.divider} />
<View style={styles.detailRow}>
  <Text style={styles.detailLabel}>Estimated Time</Text>
  <Text style={styles.detailValue}>{request.eta}</Text>
</View>
        {/* Quick Favour */}
        {request.favour && (
          <View style={styles.favourCard}>
            <Ionicons name="bag-handle-outline" size={16} color={colors.foreground} />
            <View style={styles.favourInfo}>
              <Text style={styles.favourLabel}>Quick Favour Requested</Text>
              <Text style={styles.favourText}>{request.favour}</Text>
            </View>
          </View>
        )}

        {/* Earnings Summary */}
        <View style={styles.earningsCard}>
          <Ionicons name="wallet-outline" size={16} color={colors.mutedForeground} />
          <Text style={styles.earningsText}>
  Collect <Text style={styles.earningsAmount}>{formatTSH(request.amount + Math.round(request.amount * 0.03) + 1500)}</Text> from the customer
</Text>
        </View>

      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
          <Ionicons name="close" size={20} color={colors.foreground} />
          <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <Ionicons name="checkmark" size={20} color={colors.primaryForeground} />
          <Text style={styles.acceptText}>Accept</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingTop: 56,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pulsingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  customerCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryForeground,
  },
  customerInfo: {
    flex: 1,
    gap: 2,
  },
  customerLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  customerArea: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.foreground,
  },
  distancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.foreground,
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  favourCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  favourInfo: {
    flex: 1,
    gap: 2,
  },
  favourLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  favourText: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: '500',
  },
  earningsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#F0FDF4',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  earningsText: {
    fontSize: 13,
    color: colors.mutedForeground,
    flex: 1,
  },
  earningsAmount: {
    fontWeight: '700',
    color: colors.success,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  declineButton: {
    flex: 1,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  declineText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  acceptButton: {
    flex: 2,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  acceptText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
})