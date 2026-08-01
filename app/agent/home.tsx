import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import * as Location from 'expo-location'
import AgentNavigation from '../../components/cashway/agent-navigation'
import { colors, spacing, radius, typography } from '../../constants/theme'

const BASE_URL = 'https://cashway-app.onrender.com'
const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`
const DEBT_LIMIT = 5000
const CASHWAY_LIPA = '351117111'

export default function AgentHome() {
  const router = useRouter()
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [isOnline, setIsOnline] = useState(false)
  const [loading, setLoading] = useState(true)
  const [togglingOnline, setTogglingOnline] = useState(false)
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    currentDebt: 0,
    agentName: '',
    ratingAvg: 0,
    availableFloat: 0,
  })
  const [recentDeliveries, setRecentDeliveries] = useState<any[]>([])

  const getToken = async () => {
    return await SecureStore.getItemAsync('userToken')
  }

  const stopPollingForRequests = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  const startPollingForRequests = useCallback(() => {
    stopPollingForRequests()
    pollRef.current = setInterval(async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken')
        const response = await fetch(`${BASE_URL}/api/requests/agent/current`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        if (data.hasRequest) {
          stopPollingForRequests()
          router.push('/agent/request')
        }
      } catch (err) {
        // Keep polling on network hiccup
      }
    }, 4000)
  }, [stopPollingForRequests, router])

  const fetchProfile = useCallback(async () => {
    try {
      const token = await getToken()
      const res = await fetch(`${BASE_URL}/api/agent-registration/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()

      if (res.ok && data.agent) {
        const a = data.agent
        const user = a.user || {}

        setStats({
          totalDeliveries: a.totalDeliveries || 0,
          currentDebt: a.currentDebt || 0,
          agentName: user.firstName
            ? `${user.firstName} ${user.lastName || ''}`.trim()
            : 'Agent',
          ratingAvg: a.ratingAvg || 0,
          availableFloat: a.availableFloat || 0,
        })

        const online = a.status === 'online'
        setIsOnline(online)
        if (online) startPollingForRequests()
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    } finally {
      setLoading(false)
    }
  }, [startPollingForRequests])

  const fetchRecentDeliveries = useCallback(async () => {
    try {
      const token = await getToken()
      const res = await fetch(`${BASE_URL}/api/requests/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok && data.orders) {
        const completed = data.orders
          .filter((o: any) => o.status === 'completed')
          .slice(0, 10)
        setRecentDeliveries(completed)
      }
    } catch (err) {
      console.error('Failed to fetch deliveries:', err)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
    fetchRecentDeliveries()
    return () => stopPollingForRequests()
  }, [])

  const handleToggleOnline = async (value: boolean) => {
    if (isBlocked || togglingOnline) return
    setTogglingOnline(true)

    try {
      const token = await getToken()

      if (value) {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          alert('Location permission is required to go online')
          setTogglingOnline(false)
          return
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        })

        const response = await fetch(`${BASE_URL}/api/agents/online`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            coordinates: [
              location.coords.longitude,
              location.coords.latitude
            ]
          })
        })

        const data = await response.json()

        if (response.ok) {
          setIsOnline(true)
          startPollingForRequests()
        } else {
          alert(data.message || 'Could not go online. Are you a verified agent?')
        }

      } else {
        const response = await fetch(`${BASE_URL}/api/agents/offline`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (response.ok) {
          setIsOnline(false)
          stopPollingForRequests()
        } else {
          alert(data.message || 'Could not go offline. Try again.')
        }
      }

    } catch (err) {
      alert('Connection failed. Please check your internet.')
    } finally {
      setTogglingOnline(false)
    }
  }

  const debtPercentage = (stats.currentDebt / DEBT_LIMIT) * 100
  const isBlocked = stats.currentDebt >= DEBT_LIMIT
  const isWarning = stats.currentDebt >= DEBT_LIMIT * 0.7

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.foreground} />
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      <AgentNavigation />
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
              <Text style={styles.agentName}>{stats.agentName}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={styles.ratingText}>
                  {stats.ratingAvg.toFixed(1)} · {stats.totalDeliveries} deliveries
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.onlineToggle}>
            <Text style={[
              styles.onlineLabel,
              isOnline && !isBlocked && styles.onlineLabelActive
            ]}>
              {isBlocked
                ? 'Blocked'
                : togglingOnline
                  ? 'Updating...'
                  : isOnline
                    ? 'Online'
                    : 'Offline'}
            </Text>
            <Switch
              value={isOnline && !isBlocked}
              onValueChange={handleToggleOnline}
              trackColor={{
                false: colors.border,
                true: isBlocked ? '#DC2626' : colors.success
              }}
              thumbColor={colors.card}
              disabled={isBlocked || togglingOnline}
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
                name={isBlocked ? 'ban-outline' : 'wallet-outline'}
                size={24}
                color={isBlocked
                  ? '#DC2626'
                  : isWarning
                    ? '#92400E'
                    : colors.foreground}
              />
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: `${Math.min(debtPercentage, 100)}%` as any },
                isBlocked && styles.progressFillBlocked,
                isWarning && !isBlocked && styles.progressFillWarning,
              ]} />
            </View>
            <Text style={styles.progressLabel}>{Math.round(debtPercentage)}%</Text>
          </View>

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

        {/* Stats */}
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
            <Text style={styles.overallLabel}>Available Float</Text>
            <Text style={styles.overallValue}>{formatTSH(stats.availableFloat)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.overallRow}>
            <Text style={styles.overallLabel}>Rating</Text>
            <Text style={styles.overallValue}>⭐ {stats.ratingAvg.toFixed(1)}</Text>
          </View>
        </View>

        {/* Recent Deliveries */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENT DELIVERIES</Text>
        </View>

        {recentDeliveries.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="bicycle-outline" size={32} color={colors.foreground} />
            </View>
            <Text style={styles.emptyTitle}>No deliveries yet</Text>
            <Text style={styles.emptySubtitle}>
              Go online to start receiving cash requests
            </Text>
          </View>
        ) : (
          recentDeliveries.map((delivery) => (
            <View key={delivery._id} style={styles.deliveryCard}>
              <View style={styles.deliveryLeft}>
                <View style={styles.deliveryIcon}>
                  <Ionicons name="cash-outline" size={18} color={colors.foreground} />
                </View>
                <View style={styles.deliveryInfo}>
                  <Text style={styles.deliveryAmount}>
                    {formatTSH(delivery.requestedAmount)}
                  </Text>
                  <Text style={styles.deliveryMeta}>
                    {delivery.completedAt
                      ? new Date(delivery.completedAt).toLocaleDateString()
                      : 'NIT Campus'}
                  </Text>
                </View>
              </View>
              <View style={styles.deliveryRight}>
                <Text style={styles.deliveryEarned}>
                  +{formatTSH(delivery.agentShare)}
                </Text>
                <Text style={styles.deliveryOwed}>
                  -{formatTSH(delivery.cashwayShare)} owed
                </Text>
              </View>
            </View>
          ))
        )}

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
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: 14,
    color: colors.mutedForeground,
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
emptyIconContainer: {
  width: 72,
  height: 72,
  borderRadius: radius.xl,
  backgroundColor: colors.muted,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: colors.border,
},

emptyTitle: {
  ...typography.heading3,
  color: colors.foreground,
},

emptySubtitle: {
  fontSize: 14,
  color: colors.mutedForeground,
  textAlign: 'center',
},
})