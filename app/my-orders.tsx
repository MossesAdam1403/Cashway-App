import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import Navigation from '../components/cashway/navigation'
import { colors, spacing, radius, typography } from '../constants/theme'

const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

const mapStatus = (backendStatus: string) => {
  if (backendStatus === 'completed') return 'completed'
  if (['searching', 'matched', 'confirmed'].includes(backendStatus)) return 'active'
  if (['expired', 'cancelled'].includes(backendStatus)) return 'failed'
  return 'failed'
}

const statusColor = (status: string) => {
  if (status === 'completed') return '#22C55E'
  if (status === 'active') return '#F59E0B'
  if (status === 'failed') return '#DC2626'
  return '#737373'
}

const statusLabel = (status: string) => {
  if (status === 'completed') return 'Completed'
  if (status === 'active') return 'In Progress'
  if (status === 'failed') return 'Failed'
  return status
}

const statusIcon = (status: string) => {
  if (status === 'completed') return 'checkmark-circle-outline'
  if (status === 'active') return 'time-outline'
  return 'close-circle-outline'
}

const shortOrderId = (id: string) => `CW-${id.slice(-6).toUpperCase()}`

export default function MyOrders() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'failed'>('all')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const token = await SecureStore.getItemAsync('userToken')
      const response = await fetch('https://cashway-app.onrender.com/api/requests/my-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (!response.ok) {
        setError('Could not load orders')
        return
      }
      setOrders(data.orders || [])
    } catch (err) {
      setError('Connection failed. Pull down to refresh.')
    } finally {
      setLoading(false)
    }
  }

  const mapped = orders.map(o => ({
    ...o,
    mappedStatus: mapStatus(o.status),
    displayId: shortOrderId(o._id),
    agentName: o.agent?.user
      ? `${o.agent.user.firstName} ${o.agent.user.lastName}`
      : null,
  }))

  const filtered = activeTab === 'all'
    ? mapped
    : mapped.filter(o => o.mappedStatus === activeTab)

  const countFor = (tab: string) =>
    tab === 'all' ? mapped.length : mapped.filter(o => o.mappedStatus === tab).length

  return (
    <View style={styles.screen}>
      <Navigation />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>My Orders</Text>
          <Text style={styles.pageSubtitle}>Your cash delivery history</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          <View style={styles.tabs}>
            {(['all', 'active', 'completed', 'failed'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab === 'all' ? 'All' : tab === 'active' ? 'In Progress' : tab === 'completed' ? 'Completed' : 'Failed'}
                </Text>
                <View style={[styles.tabBadge, activeTab === tab && styles.tabBadgeActive]}>
                  <Text style={[styles.tabBadgeText, activeTab === tab && styles.tabBadgeTextActive]}>
                    {countFor(tab)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.foreground} size="large" />
            <Text style={styles.loadingText}>Loading your orders...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <Ionicons name="wifi-outline" size={48} color={colors.mutedForeground} />
            <Text style={styles.emptyTitle}>Could not load orders</Text>
            <Text style={styles.emptySubtitle}>{error}</Text>
            <TouchableOpacity style={styles.requestButton} onPress={fetchOrders}>
              <Text style={styles.requestButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={colors.mutedForeground} />
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>Your cash delivery history will appear here</Text>
            <TouchableOpacity style={styles.requestButton} onPress={() => router.push('/request-cash')}>
              <Text style={styles.requestButtonText}>Request Cash</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {filtered.map((order) => (
              <View key={order._id} style={styles.orderCard}>

                <View style={styles.orderHeader}>
                  <View style={styles.orderIdRow}>
                    <Text style={styles.orderId}>{order.displayId}</Text>
                    <Text style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString('en-TZ', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor(order.mappedStatus) + '20' }]}>
                    <Ionicons name={statusIcon(order.mappedStatus) as any} size={13} color={statusColor(order.mappedStatus)} />
                    <Text style={[styles.statusText, { color: statusColor(order.mappedStatus) }]}>
                      {statusLabel(order.mappedStatus)}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.orderBody}>
                  <View style={styles.amountSection}>
                    <View style={styles.amountIcon}>
                      <Ionicons name="cash-outline" size={20} color="#22C55E" />
                    </View>
                    <View>
                      <Text style={styles.amountValue}>{formatTSH(order.requestedAmount)}</Text>
                      <Text style={styles.amountTotal}>Total paid: {formatTSH(order.total)}</Text>
                    </View>
                  </View>

                  <View style={styles.orderMeta}>
                    {order.agentName && (
                      <View style={styles.metaRow}>
                        <Ionicons name="person-outline" size={14} color={colors.mutedForeground} />
                        <Text style={styles.metaText}>{order.agentName}</Text>
                      </View>
                    )}
                    {order.favour ? (
                      <View style={styles.metaRow}>
                        <Ionicons name="bag-handle-outline" size={14} color={colors.mutedForeground} />
                        <Text style={styles.metaText}>{order.favour}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                {order.mappedStatus === 'active' && (
                  <TouchableOpacity
                    style={styles.trackButton}
                    onPress={() => router.push('/waiting')}
                  >
                    <Ionicons name="navigate-outline" size={16} color={colors.primaryForeground} />
                    <Text style={styles.trackButtonText}>Track Order</Text>
                  </TouchableOpacity>
                )}

              </View>
            ))}
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
  tabsScroll: { marginHorizontal: -spacing.md, paddingHorizontal: spacing.md },
  tabs: { flexDirection: 'row', gap: spacing.sm, paddingRight: spacing.md },
  tab: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: '500', color: colors.mutedForeground },
  tabTextActive: { color: colors.primaryForeground },
  tabBadge: { backgroundColor: colors.muted, borderRadius: radius.full, paddingHorizontal: 6, paddingVertical: 2 },
  tabBadgeActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  tabBadgeText: { fontSize: 11, fontWeight: '700', color: colors.mutedForeground },
  tabBadgeTextActive: { color: colors.primaryForeground },
  loadingState: { alignItems: 'center', paddingVertical: 64, gap: spacing.md },
  loadingText: { fontSize: 14, color: colors.mutedForeground },
  emptyState: { alignItems: 'center', paddingVertical: 64, gap: spacing.md },
  emptyTitle: { ...typography.heading3, color: colors.foreground },
  emptySubtitle: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center' },
  requestButton: { height: 48, paddingHorizontal: spacing.xl, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm },
  requestButtonText: { fontSize: 15, fontWeight: '600', color: colors.primaryForeground },
  ordersList: { gap: spacing.md },
  orderCard: { backgroundColor: colors.card, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md },
  orderIdRow: { gap: 2 },
  orderId: { fontSize: 13, color: colors.mutedForeground, fontWeight: '600' },
  orderDate: { fontSize: 12, color: colors.mutedForeground },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.full },
  statusText: { fontSize: 12, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border },
  orderBody: { padding: spacing.md, gap: spacing.md },
  amountSection: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  amountIcon: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.muted, alignItems: 'center', justifyContent: 'center' },
  amountValue: { fontSize: 20, fontWeight: '700', color: colors.foreground },
  amountTotal: { fontSize: 13, color: colors.mutedForeground, marginTop: 2 },
  orderMeta: { gap: spacing.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  metaText: { fontSize: 13, color: colors.mutedForeground },
  trackButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: 48, backgroundColor: colors.primary, margin: spacing.md, borderRadius: radius.md, marginTop: 0 },
  trackButtonText: { fontSize: 14, fontWeight: '600', color: colors.primaryForeground },
})