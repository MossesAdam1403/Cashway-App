import { View, Text, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import AgentNavigation from '../../components/cashway/agent-navigation'
import { colors, spacing, radius } from '../../constants/theme'

const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

export default function AgentNavigationScreen() {
  const router = useRouter()
  const { requestId, amount, area } = useLocalSearchParams()
  const [mapReady, setMapReady] = useState(false)
  const [arrived, setArrived] = useState(false)

  const customerLocation = { latitude: -6.8160, longitude: 39.2803 }
  const agentLocation = { latitude: -6.8100, longitude: 39.2750 }

  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${customerLocation.latitude},${customerLocation.longitude}`
    Linking.openURL(url)
  }

  const handleArrived = () => {
    setArrived(true)
  }

  const handleGetOTP = () => {
    router.push({
      pathname: '/agent/otp',
      params: { requestId, amount }
    })
  }

  return (
    <View style={styles.screen}>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: -6.8130,
            longitude: 39.2776,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onMapReady={() => setMapReady(true)}
        >
          <Marker coordinate={customerLocation} title="Customer">
            <View style={styles.customerMarker}>
              <Ionicons name="person" size={16} color={colors.primaryForeground} />
            </View>
          </Marker>
          <Marker coordinate={agentLocation} title="You">
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

        {/* Open in Google Maps button */}
        <TouchableOpacity style={styles.openMapsButton} onPress={handleOpenMaps}>
          <Ionicons name="navigate-outline" size={16} color={colors.foreground} />
          <Text style={styles.openMapsText}>Open in Maps</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>

        <View style={styles.deliveryInfo}>
          <View style={styles.deliveryIcon}>
            <Ionicons name="cash-outline" size={20} color="#22C55E" />
          </View>
          <View style={styles.deliveryText}>
            <Text style={styles.deliveryAmount}>{formatTSH(Number(amount))}</Text>
            <Text style={styles.deliveryArea}>{area}</Text>
          </View>
          <View style={styles.etaPill}>
            <Ionicons name="time-outline" size={13} color={colors.foreground} />
            <Text style={styles.etaText}>6 min</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.instruction}>
          <Ionicons name="information-circle-outline" size={16} color={colors.mutedForeground} />
          <Text style={styles.instructionText}>
            Navigate to customer location. When you arrive tap the button below.
          </Text>
        </View>

        {!arrived ? (
          <TouchableOpacity style={styles.arrivedButton} onPress={handleArrived}>
            <Ionicons name="location" size={18} color="#FFFFFF" />
            <Text style={styles.arrivedText}>I Have Arrived</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.otpButton} onPress={handleGetOTP}>
            <Ionicons name="keypad-outline" size={18} color={colors.primaryForeground} />
            <Text style={styles.otpText}>Enter Customer OTP</Text>
          </TouchableOpacity>
        )}

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
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.muted,
  },
  customerMarker: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.card,
  },
  agentMarker: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#22C55E',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.card,
  },
  openMapsButton: {
    position: 'absolute',
    top: 56,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  openMapsText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.foreground,
  },
  bottomPanel: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  deliveryIcon: {
    width: 44, height: 44, borderRadius: radius.md,
    backgroundColor: colors.muted,
    alignItems: 'center', justifyContent: 'center',
  },
  deliveryText: { flex: 1, gap: 2 },
  deliveryAmount: { fontSize: 16, fontWeight: '700', color: colors.foreground },
  deliveryArea: { fontSize: 13, color: colors.mutedForeground },
  etaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.sm, paddingVertical: 6,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.border,
  },
  etaText: { fontSize: 13, fontWeight: '600', color: colors.foreground },
  divider: { height: 1, backgroundColor: colors.border },
  instruction: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs,
  },
  instructionText: {
    fontSize: 13, color: colors.mutedForeground, flex: 1, lineHeight: 20,
  },
  arrivedButton: {
    height: 52, borderRadius: radius.md,
    backgroundColor: '#22C55E',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm,
  },
  arrivedText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  otpButton: {
    height: 52, borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm,
  },
  otpText: { fontSize: 16, fontWeight: '600', color: colors.primaryForeground },
})