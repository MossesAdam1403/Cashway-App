import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AgentNavigation from '../../components/cashway/agent-navigation'
import { colors, spacing, radius, typography } from '../../constants/theme'

const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

export default function AgentDeliveries() {
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'failed'>('all')

  // TODO: fetch from backend using JWT token
  const deliveries = [
    { id: 'DEL001', amount: 25000, customerArea: 'Kariakoo', date: 'Today 14:32', status: 'completed', earned: 1200, owedCashway: 1050 },
    { id: 'DEL002', amount: 10000, customerArea: 'Msimbazi', date: 'Today 11:15', status: 'completed', earned: 1200, owedCashway: 600 },
    { id: 'DEL003', amount: 50000, customerArea: 'Ilala', date: 'Yesterday 16:20', status: 'completed', earned: 1200, owedCashway: 2000 },
    { id: 'DEL004', amount: 75000, customerArea: 'Temeke', date: 'Yesterday 10:45', status: 'completed', earned: 1200, owedCashway: 2850 },
    { id: 'DEL005', amount: 15000, customerArea: 'Kinondoni', date: '2 days ago', status: 'failed', earned: 0, owedCashway: 0 },
    { id: 'DEL006', amount: 30000, customerArea: 'Kariakoo', date: '2 days ago', status: 'completed', earned: 1200, owedCashway: 1350 },
  ]

  const filtered = activeTab === 'all'
    ? deliveries
    : deliveries.filter(d => d.status === activeTab)

  return (
    <View style={styles.screen}>
      <AgentNavigation />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>My Deliveries</Text>
          <Text style={styles.pageSubtitle}>Your complete delivery history</Text>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {deliveries.filter(d => d.status === 'completed').length}
            </Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {deliveries.filter(d => d.status === 'failed').length}
            </Text>
            <Text style={styles.summaryLabel}>Failed</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{deliveries.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['all', 'completed', 'failed'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'all' ? 'All' : tab === 'completed' ? 'Completed' : 'Failed'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Deliveries List */}
        <View style={styles.list}>
          {filtered.map((delivery) => (
            <View key={delivery.id} style={styles.deliveryCard}>
              <View style={styles.deliveryHeader}>
                <Text style={styles.deliveryId}>{delivery.id}</Text>
                <View style={[
                  styles.statusBadge,
                  {
                    backgroundColor: delivery.status === 'completed' ? '#F0FDF4' : '#FEF2F2',
                  }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: delivery.status === 'completed' ? colors.success : colors.error }
                  ]}>
                    {delivery.status === 'completed' ? 'Completed' : 'Failed'}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.deliveryBody}>
                <View style={styles.deliveryLeft}>
                  <View style={styles.deliveryIcon}>
                    <Ionicons name="cash-outline" size={18} color="#22C55E" />
                  </View>
                  <View style={styles.deliveryInfo}>
                    <Text style={styles.deliveryAmount}>{formatTSH(delivery.amount)}</Text>
                    <Text style={styles.deliveryMeta}>
                      {delivery.customerArea} · {delivery.date}
                    </Text>
                  </View>
                </View>

                {delivery.status === 'completed' && (
                  <View style={styles.deliveryRight}>
                    <Text style={styles.earnedAmount}>+{formatTSH(delivery.earned)}</Text>
                    <Text style={styles.owedAmount}>-{formatTSH(delivery.owedCashway)} CashWay</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
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
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  summaryItem: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  summaryNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.foreground,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.mutedForeground,
  },
  tabTextActive: {
    color: colors.foreground,
    fontWeight: '600',
  },
  list: {
    gap: spacing.sm,
  },
  deliveryCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  deliveryId: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: colors.mutedForeground,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  deliveryBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
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
    fontSize: 15,
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
  earnedAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.success,
  },
  owedAmount: {
    fontSize: 11,
    color: '#DC2626',
  },
})