import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import AgentNavigation from '../../components/cashway/agent-navigation'
import { colors, spacing, radius, typography } from '../../constants/theme'

const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

const mapStatus = (status: string) => {
  if (status === 'completed') return { label: 'Completed', color: '#22C55E', icon: 'checkmark-circle-outline' }
  if (['confirmed', 'arrived'].includes(status)) return { label: 'In Progress', color: '#F59E0B', icon: 'time-outline' }
  if (status === 'cancelled') return { label: 'Cancelled', color: '#DC2626', icon: 'close-circle-outline' }
  return { label: status, color: colors.mutedForeground, icon: 'ellipse-outline' }
}

const shortId = (id: string) => `CW-${id.slice(-6).toUpperCase()}`

export default function AgentDeliveries() {
  const router = useRouter()
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'active'>('all')

  useEffect(() => {
    fetchDeliveries()
  }, [])

  const fetchDeliveries = async () => {
    setLoading(true)
    setError('')
    try {
      const token = await SecureStore.getItemAsync('userToken')
      const response = await fetch(
        'https://cashway-app.onrender.com/api/requests/agent/deliveries',
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const data = await response.json()
      if (!response.ok) {
        setError('Could not load deliveries')
        return
      }
      setDeliveries(data.orders || [])
    } catch (err) {
      setError('Connection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = activeTab === 'all'
    ? deliveries
    : activeTab === 'completed'
    ? deliveries.filter(d => d.status === 'completed')
    : deliveries.filter(d => ['confirmed', 'arrived'].includes(d.status))

  const totalEarned = deliveries
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + (d.agentShare || 0), 0)

  return (
    <View style={styles.screen}>
      <AgentNavigation />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>My Deliveries</Text>
          <Text style={styles.pageSubtitle}>Your complete delivery history</Text>
        </View>

        {/* Earnings Summary */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsStat}>
            <Text style={styles.earningsNumber}>{deliveries.filter(d => d.status === 'completed').length}</Text>
            <Text style={styles.earningsLabel}>Completed</Text>
          </View>
          <View style={styles.earningsDivider} />
          <View style={styles.earningsStat}>
            <Text style={styles.earningsNumber}>{formatTSH(totalEarned)}</Text>
            <Text style={styles.earningsLabel}>Total Earned</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'all' ? 'All' : tab === 'active' ? 'In Progress' : 'Completed'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.foreground} size="large" />
            <Text style={styles.stateText}>Loading deliveries...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerState}>
            <Ionicons name="wifi-outline" size={48} color={colors.mutedForeground} />
            <Text style={styles.stateTitle}>Could not load deliveries</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchDeliveries}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.centerState}>
            <Ionicons name="bicycle-outline" size={48} color={colors.mutedForeground} />
            <Text style={styles.stateTitle}>No deliveries yet</Text>
            <Text style={styles.stateText}>Go online to start receiving delivery requests</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filtered.map((delivery) => {
              const statusInfo = mapStatus(delivery.status)
              const customerName = delivery.customer
                ? `${delivery.customer.firstName} ${delivery.customer.lastName}`
                : 'Customer'

              return (
                <View key={delivery._id} style={styles.deliveryCard}>

                  <View style={styles.cardHeader}>
                    <Text style={styles.deliveryId}>{shortId(delivery._id)}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
                      <Ionicons name={statusInfo.icon as any} size={12} color={statusInfo.color} />
                      <Text style={[styles.statusText, { color: statusInfo.color }]}>
                        {statusInfo.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.cardBody}>
                    <View style={styles.amountRow}>
                      <View style={styles.amountIcon}>
                        <Ionicons name="cash-outline" size={18} color="#22C55E" />
                      </View>
                      <View>
                        <Text style={styles.amountValue}>{formatTSH(delivery.requestedAmount)}</Text>
                        <Text style={styles.amountSub}>
                          {delivery.status === 'completed'
                            ? `You earned: ${formatTSH(delivery.agentShare || 0)}`
                            : `Collect: ${formatTSH(delivery.total || 0)}`
                          }
                        </Text>
                      </View>
                    </View>

                    <View style={styles.metaRow}>
                      <Ionicons name="person-outline" size={13} color={colors.mutedForeground} />
                      <Text style={styles.metaText}>{customerName}</Text>
                    </View>

                    <View style={styles.metaRow}>
                      <Ionicons name="time-outline" size={13} color={colors.mutedForeground} />
                      <Text style={styles.metaText}>
                        {new Date(delivery.createdAt).toLocaleDateString('en-TZ', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </Text>
                    </View>

                    {delivery.favour ? (
                      <View style={styles.metaRow}>
                        <Ionicons name="bag-handle-outline" size={13} color={colors.mutedForeground} />
                        <Text style={styles.metaText}>{delivery.favour}</Text>
                      </View>
                    ) : null}
                  </View>

                </View>
              )
            })}
          </View>
        )}

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 80, gap: spacing.lg },
  pageHeader: { paddingTop: spacing.md, gap: spacing.xs },
  pageTitle: { ...typography.heading2, color: colors.foreground },
  pageSubtitle: { ...typography.small, color: colors.mutedForeground },
  earningsCard: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  earningsStat: { flex: 1, padding: spacing.lg, alignItems: 'center', gap: spacing.xs },
  earningsDivider: { width: 1, backgroundColor: colors.border },
  earningsNumber: { fontSize: 18, fontWeight: '700', color: colors.foreground },
  earningsLabel: { fontSize: 12, color: colors.mutedForeground },
  tabs: { flexDirection: 'row', gap: spacing.sm },
  tab: { flex: 1, height: 40, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: '500', color: colors.mutedForeground },
  tabTextActive: { color: colors.primaryForeground },
  centerState: { alignItems: 'center', paddingVertical: 64, gap: spacing.md },
  stateTitle: { ...typography.heading3, color: colors.foreground },
  stateText: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center' },
  retryButton: { height: 44, paddingHorizontal: spacing.xl, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  retryText: { fontSize: 14, fontWeight: '600', color: colors.primaryForeground },
  list: { gap: spacing.md },
  deliveryCard: { backgroundColor: colors.card, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md },
  deliveryId: { fontSize: 13, fontWeight: '600', color: colors.mutedForeground },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.full },
  statusText: { fontSize: 12, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border },
  cardBody: { padding: spacing.md, gap: spacing.sm },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  amountIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.muted, alignItems: 'center', justifyContent: 'center' },
  amountValue: { fontSize: 18, fontWeight: '700', color: colors.foreground },
  amountSub: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  metaText: { fontSize: 13, color: colors.mutedForeground },
})