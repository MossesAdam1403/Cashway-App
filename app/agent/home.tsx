import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AgentNavigation from '../../components/cashway/agent-navigation'
import { colors, spacing, radius, typography } from '../../constants/theme'

const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

const DEBT_LIMIT = 5000
const CASHWAY_LIPA = '123456' // TODO: replace with real CashWay Lipa namba

export default function AgentHome() {
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(false)

  // TODO: fetch from backend
  const stats = {
    totalDeliveries: 47,
    totalCashDelivered: 1250000,
    totalEarned: 94000,
    todayDeliveries: 3,
    todayEarned: 6000,
    currentDebt: 3600, // amount agent owes CashWay
  }

  const recentDeliveries = [
    { id: '1', amount: 25000, area: 'Kariakoo', date: 'Today 14:30', status: 'paid', earned: 1200, owedToCashway: 600 },
    { id: '2', amount: 10000, area: 'Msimbazi', date: 'Today 11:15', status: 'paid', earned: 1200, owedToCashway: 300 },
    { id: '3', amount: 50000, area: 'Ilala', date: 'Yesterday', status: 'paid', earned: 1200, owedToCashway: 1500 },
    { id: '4', amount: 15000, area: 'Temeke', date: 'Yesterday', status: 'paid', earned: 1200, owedToCashway: 450 },
  ]

  const debtPercentage = (stats.currentDebt / DEBT_LIMIT) * 100
  const isBlocked = stats.currentDebt >= DEBT_LIMIT
  const isWarning = stats.currentDebt >= DEBT_LIMIT * 0.7

  const handleToggleOnline = (value: boolean) => {
    if (isBlocked) return
    setIsOnline(value)
  }

  return (
    <View style={styles.screen}>
      <AgentNavigation  />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Blocked Banner */}
        {isBlocked && (
          <View style={styles.blockedBanner}>
            <Ionicons name="ban-outline" size={20} color="#DC2626" />
            <View style={styles.blockedInfo}>
              <Text style={styles.blockedTitle}>Account Blocked</Text>
              <Text style={styles.blockedSubtitle}>
                You have reached the TSH 5,000 limit. Pay CashWay to resume orders.
              </Text>
            </View>
          </View>
        )}

        {/* Warning Banner */}
        {isWarning && !isBlocked && (
          <View style={styles.warningBanner}>
            <Ionicons name="warning-outline" size={16} color="#92400E" />
            <Text style={styles.warningText}>
              You are approaching your limit — {formatTSH(DEBT_LIMIT - stats.currentDebt)} remaining
            </Text>
          </View>
        )}

        {/* Agent Header */}
        <View style={styles.agentHeader}>
          <View style={styles.agentInfo}>
            <View style={styles.agentAvatar}>
              <Ionicons name="person" size={24} color={colors.foreground} />
            </View>
            <View>
              {/* TODO: replace with real agent name */}
              <Text style={styles.agentName}>James Mwangi</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={styles.ratingText}>4.8 · 47 deliveries</Text>
              </View>
            </View>
          </View>

          {/* Online Toggle */}
          <View style={styles.onlineToggle}>
            <Text style={[styles.onlineLabel, isOnline && !isBlocked && styles.onlineLabelActive]}>
              {isBlocked ? 'Blocked' : isOnline ? 'Online' : 'Offline'}
            </Text>
            <Switch
              value={isOnline && !isBlocked}
              onValueChange={handleToggleOnline}
              trackColor={{ false: colors.border, true: isBlocked ? '#DC2626' : colors.success }}
              thumbColor={colors.card}
              disabled={isBlocked}
            />
          </View>
        </View>

        {/* Online/Offline Banner */}
        {!isBlocked && (
          isOnline ? (
            <View style={styles.onlineBanner}>
              <Ionicons name="radio-outline" size={16} color={colors.success} />
              <Text style={styles.onlineBannerText}>
                You are online — waiting for requests
              </Text>
            </View>
          ) : (
            <View style={styles.offlineBanner}>
              <Ionicons name="moon-outline" size={16} color={colors.mutedForeground} />
              <Text style={styles.offlineBannerText}>
                You are offline — go online to receive requests
              </Text>
            </View>
          )
        )}

        {/* Debt Card */}
        <View style={[
          styles.debtCard,
          isBlocked && styles.debtCardBlocked,
          isWarning && !isBlocked && styles.debtCardWarning,
        ]}>
          <View style={styles.debtHeader}>
            <View>
              <Text style={styles.debtLabel}>Amount Owed to CashWay</Text>
              <Text style={[
                styles.debtAmount,
                isBlocked && { color: '#DC2626' },
                isWarning && !isBlocked && { color: '#92400E' },
              ]}>
                {formatTSH(stats.currentDebt)}
              </Text>
              <Text style={styles.debtLimit}>Limit: {formatTSH(DEBT_LIMIT)}</Text>
            </View>
            <View style={styles.debtIconContainer}>
              <Ionicons
                name={isBlocked ? "ban-outline" : "wallet-outline"}
                size={24}
                color={isBlocked ? '#DC2626' : isWarning ? '#92400E' : colors.foreground}
              />
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: `${Math.min(debtPercentage, 100)}%` },
                isBlocked && styles.progressFillBlocked,
                isWarning && !isBlocked && styles.progressFillWarning,
              ]} />
            </View>
            <Text style={styles.progressLabel}>{Math.round(debtPercentage)}%</Text>
          </View>

          {/* Pay Now Section */}
          {(isWarning || isBlocked) && (
            <View style={styles.paySection}>
              <View style={styles.lipaRow}>
                <Ionicons name="phone-portrait-outline" size={14} color={colors.mutedForeground} />
                <Text style={styles.lipaLabel}>Pay via Lipa Namba:</Text>
                <Text style={styles.lipaNumber}>{CASHWAY_LIPA}</Text>
              </View>
              <Text style={styles.payInstruction}>
                Send {formatTSH(stats.currentDebt)} to clear your balance and resume receiving orders
              </Text>
            </View>
          )}
        </View>

        {/* Today Stats */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TODAY</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="bicycle-outline" size={22} color={colors.foreground} />
            <Text style={styles.statNumber}>{stats.todayDeliveries}</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cash-outline" size={22} color="#22C55E" />
            <Text style={styles.statNumber}>{formatTSH(stats.todayEarned)}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={22} color={colors.foreground} />
            <Text style={styles.statNumber}>8 min</Text>
            <Text style={styles.statLabel}>Avg Time</Text>
          </View>
        </View>

        {/* Overall Stats */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>OVERALL</Text>
        </View>
        <View style={styles.overallCard}>
          <View style={styles.overallRow}>
            <Text style={styles.overallLabel}>Total Deliveries</Text>
            <Text style={styles.overallValue}>{stats.totalDeliveries}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.overallRow}>
            <Text style={styles.overallLabel}>Total Cash Delivered</Text>
            <Text style={styles.overallValue}>{formatTSH(stats.totalCashDelivered)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.overallRow}>
            <Text style={styles.overallLabel}>Total Earned (Fees)</Text>
            <Text style={styles.overallValue}>{formatTSH(stats.totalEarned)}</Text>
          </View>
        </View>

        {/* Recent Deliveries */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENT DELIVERIES</Text>
        </View>

        {recentDeliveries.map((delivery) => (
          <View key={delivery.id} style={styles.deliveryCard}>
            <View style={styles.deliveryLeft}>
              <View style={styles.deliveryIcon}>
                <Ionicons name="cash-outline" size={18} color="#22C55E" />
              </View>
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryAmount}>{formatTSH(delivery.amount)}</Text>
                <Text style={styles.deliveryMeta}>{delivery.area} · {delivery.date}</Text>
              </View>
            </View>
            <View style={styles.deliveryRight}>
              <Text style={styles.deliveryEarned}>+{formatTSH(delivery.earned)}</Text>
              <Text style={styles.deliveryOwed}>-{formatTSH(delivery.owedToCashway)} to CashWay</Text>
            </View>
          </View>
        ))}

      </ScrollView>

      {/* Incoming Request Button — only when online and not blocked */}
      {isOnline && !isBlocked && (
        <TouchableOpacity
          style={styles.testRequestButton}
          onPress={() => router.push('/agent/request')}
        >
          <Ionicons name="notifications" size={18} color={colors.primaryForeground} />
          <Text style={styles.testRequestText}>Simulate Incoming Request</Text>
        </TouchableOpacity>
      )}
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
    paddingBottom: 100,
    gap: spacing.md,
  },
  blockedBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: '#FEF2F2',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  blockedInfo: {
    flex: 1,
    gap: 2,
  },
  blockedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  blockedSubtitle: {
    fontSize: 13,
    color: '#DC2626',
    lineHeight: 18,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#FFFBEB',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '500',
    flex: 1,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  agentAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  onlineToggle: {
    alignItems: 'center',
    gap: 4,
  },
  onlineLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  onlineLabelActive: {
    color: colors.success,
  },
  onlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#F0FDF4',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  onlineBannerText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.success,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  offlineBannerText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  debtCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  debtCardBlocked: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  debtCardWarning: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB',
  },
  debtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  debtLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: '500',
    marginBottom: 4,
  },
  debtAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  debtLimit: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  debtIconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.foreground,
    borderRadius: radius.full,
  },
  progressFillBlocked: {
    backgroundColor: '#DC2626',
  },
  progressFillWarning: {
    backgroundColor: '#F59E0B',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
    minWidth: 36,
  },
  paySection: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
  },
  lipaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  lipaLabel: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  lipaNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.foreground,
  },
  payInstruction: {
    fontSize: 13,
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  overallCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  overallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  overallValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  deliveryCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deliveryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  deliveryIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryInfo: {
    gap: 2,
  },
  deliveryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  deliveryMeta: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  deliveryRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  deliveryEarned: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.success,
  },
  deliveryOwed: {
    fontSize: 11,
    color: '#DC2626',
  },
  testRequestButton: {
    position: 'absolute',
    bottom: 24,
    left: spacing.md,
    right: spacing.md,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  testRequestText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
})