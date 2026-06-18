import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AgentNavigation from '../../components/cashway/agent-navigation'
import { colors, spacing, radius, typography } from '../../constants/theme'

const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

const DEBT_LIMIT = 5000
const CASHWAY_LIPA = '123456'

export default function AgentEarnings() {

  // TODO: fetch from backend using JWT token
  const earnings = {
    currentDebt: 3600,
    totalEarned: 56400,
    totalPaidToCashway: 52800,
    thisWeekEarned: 8400,
    thisMonthEarned: 24000,
  }

  const paymentHistory = [
    { id: 'PAY001', amount: 3200, date: 'Today 09:15', status: 'cleared' },
    { id: 'PAY002', amount: 4800, date: 'Yesterday 14:30', status: 'cleared' },
    { id: 'PAY003', amount: 2600, date: '3 days ago', status: 'cleared' },
    { id: 'PAY004', amount: 5000, date: '5 days ago', status: 'cleared' },
  ]

  const debtPercentage = (earnings.currentDebt / DEBT_LIMIT) * 100
  const isBlocked = earnings.currentDebt >= DEBT_LIMIT
  const isWarning = earnings.currentDebt >= DEBT_LIMIT * 0.7

  return (
    <View style={styles.screen}>
      <AgentNavigation />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>My Earnings</Text>
          <Text style={styles.pageSubtitle}>Track your earnings and CashWay payments</Text>
        </View>

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
                {formatTSH(earnings.currentDebt)}
              </Text>
              <Text style={styles.debtLimit}>Limit: {formatTSH(DEBT_LIMIT)}</Text>
            </View>
            <Ionicons
              name={isBlocked ? "ban-outline" : "wallet-outline"}
              size={28}
              color={isBlocked ? '#DC2626' : isWarning ? '#92400E' : colors.foreground}
            />
          </View>

          {/* Progress Bar */}
          <View style={styles.progressRow}>
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

          {/* Pay Now */}
          {(isWarning || isBlocked) && (
            <View style={styles.paySection}>
              <View style={styles.lipaRow}>
                <Ionicons name="phone-portrait-outline" size={14} color={colors.mutedForeground} />
                <Text style={styles.lipaLabel}>Pay via Lipa Namba:</Text>
                <Text style={styles.lipaNumber}>{CASHWAY_LIPA}</Text>
              </View>
              <Text style={styles.payInstruction}>
                Send {formatTSH(earnings.currentDebt)} to clear your balance
              </Text>
            </View>
          )}
        </View>

        {/* Earnings Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EARNINGS SUMMARY</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>This Week</Text>
              <Text style={styles.summaryValue}>{formatTSH(earnings.thisWeekEarned)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>This Month</Text>
              <Text style={styles.summaryValue}>{formatTSH(earnings.thisMonthEarned)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Earned (All Time)</Text>
              <Text style={styles.summaryValue}>{formatTSH(earnings.totalEarned)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Paid to CashWay</Text>
              <Text style={[styles.summaryValue, { color: '#DC2626' }]}>
                -{formatTSH(earnings.totalPaidToCashway)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PAYMENT HISTORY TO CASHWAY</Text>
          <View style={styles.historyCard}>
            {paymentHistory.map((payment, index) => (
              <View key={payment.id}>
                <View style={styles.paymentRow}>
                  <View style={styles.paymentLeft}>
                    <View style={styles.paymentIcon}>
                      <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                    </View>
                    <View style={styles.paymentInfo}>
                      <Text style={styles.paymentId}>{payment.id}</Text>
                      <Text style={styles.paymentDate}>{payment.date}</Text>
                    </View>
                  </View>
                  <Text style={styles.paymentAmount}>
                    -{formatTSH(payment.amount)}
                  </Text>
                </View>
                {index < paymentHistory.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
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
    gap: spacing.lg,
  },
  pageHeader: {
    paddingTop: spacing.md,
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
  progressRow: {
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
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
    letterSpacing: 1,
    paddingLeft: spacing.xs,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  paymentIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: {
    gap: 2,
  },
  paymentId: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.foreground,
    fontFamily: 'monospace',
  },
  paymentDate: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
})