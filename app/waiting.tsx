import { View, Text, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState, useEffect, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as SecureStore from 'expo-secure-store'
import Navigation from '../components/cashway/navigation'
import { colors, spacing, radius, typography } from '../constants/theme'

const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

export default function Waiting() {
  const router = useRouter()
  const { requestId, amount, agentName, agentPhone, total, favour } = useLocalSearchParams()
  const [mapReady, setMapReady] = useState(false)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const checkOrderStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken')

      const response = await fetch(
        `https://cashway-app.onrender.com/api/requests/${requestId}/status`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )

      const data = await response.json()

      // Backward transition — agent cancelled, system is re-matching
      if (data.status === 'searching') {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
        router.replace({
          pathname: '/finding-agent',
          params: { requestId, amount }
        })
      }

      // Order expired while waiting
      if (data.status === 'expired') {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
        router.replace('/home')
      }

      // status === 'confirmed' — no action needed, stay on this screen

    } catch (err) {
      // Network hiccup — keep trying on next poll, don't disrupt the user
    }
  }

  useEffect(() => {
    pollIntervalRef.current = setInterval(checkOrderStatus, 4000)
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [])

  const handleCall = () => {
    Linking.openURL(`tel:${agentPhone}`)
  }

  const handleMessage = () => {
    Linking.openURL(`sms:${agentPhone}`)
  }

  const handleGetCash = () => {
    router.push({
      pathname: '/otp-verification',
      params: { requestId, amount, agentName, total }
    })
  }

  // Dar es Salaam coordinates (default)
  const userLocation = {
    latitude: -6.7924,
    longitude: 39.2083,
  }

  // Simulated agent location nearby
  const agentLocation = {
    latitude: -6.7854,
    longitude: 39.2143,
  }

  return (
    <View style={styles.screen}>
      <Navigation />

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: -6.7924,
            longitude: 39.2083,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onMapReady={() => setMapReady(true)}
        >
          {/* User Location */}
          <Marker coordinate={userLocation} title="You">
            <View style={styles.userMarker}>
              <Ionicons name="person" size={16} color={colors.primaryForeground} />
            </View>
          </Marker>

          {/* Agent Location */}
          <Marker coordinate={agentLocation} title={agentName as string}>
            <View style={styles.agentMarker}>
              <Ionicons name="bicycle" size={16} color={colors.primaryForeground} />
            </View>
          </Marker>
        </MapView>

        {!mapReady && (
          <View style={styles.mapLoading}>
            <ActivityIndicator color={colors.foreground} />
          </View>
        )}
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>

        {/* Agent Info */}
        <View style={styles.agentRow}>
          <View style={styles.agentAvatar}>
            <Ionicons name="person" size={22} color={colors.foreground} />
          </View>
          <View style={styles.agentInfo}>
            <Text style={styles.agentName}>{agentName}</Text>
            <Text style={styles.agentStatus}>Agent is on the way</Text>
          </View>
        </View>

        {/* Amount + Favour */}
        <View style={styles.infoRow}>
          <View style={styles.infoPill}>
            <Ionicons name="cash-outline" size={13} color={colors.mutedForeground} />
            <Text style={styles.infoPillText}>{formatTSH(Number(amount))}</Text>
          </View>
          {favour ? (
            <View style={styles.infoPill}>
              <Ionicons name="bag-handle-outline" size={13} color={colors.mutedForeground} />
              <Text style={styles.infoPillText} numberOfLines={1}>{favour}</Text>
            </View>
          ) : null}
        </View>

        {/* Call + Message */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons name="call-outline" size={20} color={colors.foreground} />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleMessage}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.foreground} />
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Get Cash Button */}
        <TouchableOpacity style={styles.getCashButton} onPress={handleGetCash}>
          <Ionicons name="flash" size={18} color={colors.primaryForeground} />
          <Text style={styles.getCashText}>Get My Cash</Text>
        </TouchableOpacity>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark-outline" size={13} color={colors.mutedForeground} />
          <Text style={styles.securityText}>
            Tap "Get My Cash" only when agent is physically with you
          </Text>
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.muted,
  },
  userMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  agentMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  bottomPanel: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 10,
  },
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentInfo: {
    flex: 1,
    gap: 2,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  agentStatus: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  etaPill: {
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
  etaText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.foreground,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: '60%',
  },
  infoPillText: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.card,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  getCashButton: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  getCashText: {
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