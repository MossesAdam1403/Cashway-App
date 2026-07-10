import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState, useEffect, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Navigation from '../components/cashway/navigation'
import { colors, spacing, radius, typography } from '../constants/theme'
import * as SecureStore from 'expo-secure-store'
const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

export default function FindingAgent() {
  const router = useRouter()
  const { requestId, amount, lat, lng } = useLocalSearchParams()
  const [status, setStatus] = useState<'searching' | 'found' | 'notfound'>('searching')
  const [agent, setAgent] = useState<any>(null)

  // Pulse animations
  const ring1 = useRef(new Animated.Value(0)).current
  const ring2 = useRef(new Animated.Value(0)).current
  const ring3 = useRef(new Animated.Value(0)).current
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startPulse = () => {
    const createRingAnimation = (ring: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(ring, {
            toValue: 1,
            duration: 1800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(ring, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      )
    }

    Animated.parallel([
      createRingAnimation(ring1, 0),
      createRingAnimation(ring2, 500),
      createRingAnimation(ring3, 1000),
    ]).start()
  }

  const checkRequestStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken')

      const response = await fetch(
        `https://cashway-app.onrender.com/api/requests/${requestId}/status`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )

      const data = await response.json()

      if (data.status === 'matched') {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
        setAgent({
          id: data.agent.id,
          name: data.agent.name,
          rating: data.agent.rating,
          deliveries: data.agent.deliveries,
          eta: '8 min',
          phone: data.agent.phone,
        })
        setStatus('found')
      } else if (data.status === 'expired') {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
        setStatus('notfound')
      }
      // if status is still 'searching', do nothing — keep polling

    } catch (err) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
      setStatus('notfound')
    }
  }

  const startPolling = () => {
    checkRequestStatus()
    pollIntervalRef.current = setInterval(checkRequestStatus, 3000)

    searchTimeoutRef.current = setTimeout(() => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
      setStatus('notfound')
    }, 40000)
  }

  useEffect(() => {
    startPulse()
    startPolling()

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [])

  const handleGetCash = () => {
    router.push({
      pathname: '/order-summary',
      params: {
        requestId,
        amount,
        lat,
        lng,
        agentName: agent?.name,
        agentPhone: agent?.phone,
      }
    })
  }

  const handleRetry = () => {
    setStatus('searching')
    ring1.setValue(0)
    ring2.setValue(0)
    ring3.setValue(0)
    startPulse()
    startPolling()
  }

  return (
    <View style={styles.screen}>
      <Navigation />

      <View style={styles.container}>

        {/* Amount Pill */}
        <View style={styles.amountPill}>
          <Ionicons name="cash-outline" size={14} color={colors.mutedForeground} />
          <Text style={styles.amountText}>{formatTSH(Number(amount))}</Text>
        </View>

        {/* Center Animation or Result */}
        <View style={styles.centerSection}>

          {status === 'searching' && (
            <>
              {/* Radar Rings */}
              <View style={styles.radarContainer}>
                {[ring1, ring2, ring3].map((ring, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.ring,
                      {
                        opacity: ring.interpolate({
                          inputRange: [0, 0.3, 1],
                          outputRange: [0, 0.4, 0],
                        }),
                        transform: [{
                          scale: ring.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 3.5],
                          }),
                        }],
                      }
                    ]}
                  />
                ))}

                {/* Center Icon */}
                <View style={styles.centerIcon}>
                  <Ionicons name="location" size={28} color={colors.primaryForeground} />
                </View>
              </View>

              <Text style={styles.searchingTitle}>Finding your agent...</Text>
              <Text style={styles.searchingSubtitle}>
                Searching for the nearest agent{'\n'}to deliver your cash
              </Text>
              <Text style={styles.timeNote}>Usually takes under 30 seconds</Text>
            </>
          )}

          {status === 'found' && agent && (
            <>
              {/* Success Icon */}
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={40} color={colors.primaryForeground} />
              </View>

              <Text style={styles.foundTitle}>Agent Found!</Text>
              <Text style={styles.foundSubtitle}>Your cash is on its way</Text>

              {/* Agent Card */}
              <View style={styles.agentCard}>
                <View style={styles.agentAvatar}>
                  <Ionicons name="person" size={28} color={colors.foreground} />
                </View>
                <View style={styles.agentInfo}>
                  <Text style={styles.agentName}>{agent.name}</Text>
                  <View style={styles.agentMeta}>
                    <Ionicons name="star" size={13} color="#F59E0B" />
                    <Text style={styles.agentRating}>{agent.rating}</Text>
                    <Text style={styles.agentDeliveries}>· {agent.deliveries} deliveries</Text>
                  </View>
                </View>
                <View style={styles.etaContainer}>
                  <Ionicons name="time-outline" size={14} color={colors.mutedForeground} />
                  <Text style={styles.etaText}>{agent.eta}</Text>
                </View>
              </View>

              {/* Get Cash Button */}
              <TouchableOpacity style={styles.getCashButton} onPress={handleGetCash}>
                <Ionicons name="flash" size={18} color={colors.primaryForeground} />
                <Text style={styles.getCashText}>Get Cash</Text>
              </TouchableOpacity>
            </>
          )}

          {status === 'notfound' && (
            <>
              <View style={styles.errorIcon}>
                <Ionicons name="alert-circle" size={40} color={colors.error} />
              </View>

              <Text style={styles.notFoundTitle}>No Agents Available</Text>
              <Text style={styles.notFoundSubtitle}>
                There are no agents near you{'\n'}right now. Please try again.
              </Text>

              <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <Ionicons name="refresh-outline" size={18} color={colors.primaryForeground} />
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </>
          )}

        </View>
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
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  amountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    width: '100%',
  },
  radarContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  centerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  searchingTitle: {
    ...typography.heading2,
    color: colors.foreground,
    textAlign: 'center',
  },
  searchingSubtitle: {
    ...typography.body,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 24,
  },
  timeNote: {
    fontSize: 12,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foundTitle: {
    ...typography.heading2,
    color: colors.foreground,
    textAlign: 'center',
  },
  foundSubtitle: {
    ...typography.small,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    gap: spacing.md,
  },
  agentAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentInfo: {
    flex: 1,
    gap: 4,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  agentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  agentRating: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.foreground,
  },
  agentDeliveries: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  etaContainer: {
    alignItems: 'center',
    gap: 2,
  },
  etaText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.foreground,
  },
  getCashButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    width: '100%',
  },
  getCashText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundTitle: {
    ...typography.heading2,
    color: colors.foreground,
    textAlign: 'center',
  },
  notFoundSubtitle: {
    ...typography.body,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 24,
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