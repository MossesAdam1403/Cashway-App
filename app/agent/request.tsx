import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Vibration } from 'react-native'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import { colors, spacing, radius, typography } from '../../constants/theme'

const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

const DELIVERY_FEE = 1000
const SERVICE_FEE_RATE = 0.03

export default function AgentRequest() {
  const router = useRouter()
  const [request, setRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCurrentRequest()
  }, [])

  const fetchCurrentRequest = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken')
      const response = await fetch(
        'https://cashway-app.onrender.com/api/requests/agent/current',
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const data = await response.json()

      if (data.hasRequest) {
        setRequest(data)
        Vibration.vibrate([0, 500, 200, 500])
      } else {
        // No active request — go back to home
        router.replace('/agent/home')
      }
    } catch (err) {
      setError('Could not load request details')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    if (!request) return
    setActing(true)
    try {
      const token = await SecureStore.getItemAsync('userToken')
      const response = await fetch(
        `https://cashway-app.onrender.com/api/requests/${request.requestId}/confirm`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        }
      )

      if (response.ok) {
        router.replace({
          pathname: '/agent/navigation',
          params: {
            requestId: request.requestId,
            amount: request.amount,
            area: 'Customer Location',
            customerLat: request.location?.[1],
            customerLng: request.location?.[0],
          }
        })
      } else {
        setError('Could not accept request. Please try again.')
      }
    } catch (err) {
      setError('Connection failed.')
    } finally {
      setActing(false)
    }
  }

  const handleDecline = async () => {
    if (!request) return
    setActing(true)
    try {
      const token = await SecureStore.getItemAsync('userToken')
      await fetch(
        `https://cashway-app.onrender.com/api/requests/${request.requestId}/decline`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        }
      )
    } catch (err) {
      // Proceed regardless
    } finally {
      router.replace('/agent/home')
    }
  }

  if (loading) {
    return (
      <View style={[styles.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.foreground} size="large" />
      </View>
    )
  }

  if (error || !request) {
    return (
      <View style={[styles.screen, { alignItems: 'center', justifyContent: 'center', padding: spacing.lg }]}>
        <Text style={{ color: colors.error, textAlign: 'center' }}>{error || 'No active request'}</Text>
        <TouchableOpacity onPress={() => router.replace('/agent/home')} style={{ marginTop: spacing.lg }}>
          <Text style={{ color: colors.foreground, fontWeight: '600' }}>Go Home</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const serviceFee = Math.round(request.amount * SERVICE_FEE_RATE)
  const totalCustomerPays = request.amount + serviceFee + DELIVERY_FEE

  return (
    <View style={styles.screen}>

      <View style={styles.header}>
        <View style={styles.pulsingDot} />
        <Text style={styles.headerText}>New Cash Request</Text>
      </View>

      <View style={styles.content}>

        <View style={styles.customerCard}>
          <View style={styles.customerAvatar}>
            <Text style={styles.customerInitial}>
              {request.customerName ? request.customerName[0].toUpperCase() : 'C'}
            </Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerLabel}>Customer</Text>
            <Text style={styles.customerArea}>{request.customerPhone}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Cash to Deliver</Text>
          <Text style={styles.detailValue}>{formatTSH(request.amount)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Customer Pays</Text>
          <Text style={[styles.detailValue, { color: colors.success }]}>
            {formatTSH(totalCustomerPays)}
          </Text>
        </View>

        {request.favour ? (
          <View style={styles.favourCard}>
            <Ionicons name="bag-handle-outline" size={16} color={colors.foreground} />
            <View style={styles.favourInfo}>
              <Text style={styles.favourLabel}>Quick Favour Requested</Text>
              <Text style={styles.favourText}>{request.favour}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.earningsCard}>
          <Ionicons name="wallet-outline" size={16} color={colors.mutedForeground} />
          <Text style={styles.earningsText}>
            Collect{' '}
            <Text style={styles.earningsAmount}>{formatTSH(totalCustomerPays)}</Text>
            {' '}from the customer
          </Text>
        </View>

        {error ? (
          <Text style={{ color: colors.error, textAlign: 'center', fontSize: 13 }}>{error}</Text>
        ) : null}

      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.declineButton} onPress={handleDecline} disabled={acting}>
          <Ionicons name="close" size={20} color={colors.foreground} />
          <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept} disabled={acting}>
          {acting ? (
            <ActivityIndicator color={colors.primaryForeground} size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color={colors.primaryForeground} />
              <Text style={styles.acceptText}>Accept</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingTop: 56, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  pulsingDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success },
  headerText: { fontSize: 18, fontWeight: '700', color: colors.foreground },
  content: { flex: 1, padding: spacing.md, gap: spacing.md },
  customerCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  customerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  customerInitial: { fontSize: 20, fontWeight: '700', color: colors.primaryForeground },
  customerInfo: { flex: 1, gap: 2 },
  customerLabel: { fontSize: 12, color: colors.mutedForeground },
  customerArea: { fontSize: 15, fontWeight: '600', color: colors.foreground },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: 14, color: colors.mutedForeground },
  detailValue: { fontSize: 14, fontWeight: '700', color: colors.foreground },
  divider: { height: 1, backgroundColor: colors.border },
  favourCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.muted, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  favourInfo: { flex: 1, gap: 2 },
  favourLabel: { fontSize: 12, color: colors.mutedForeground, fontWeight: '500' },
  favourText: { fontSize: 14, color: colors.foreground, fontWeight: '500' },
  earningsCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: '#F0FDF4', borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: '#BBF7D0' },
  earningsText: { fontSize: 13, color: colors.mutedForeground, flex: 1 },
  earningsAmount: { fontWeight: '700', color: colors.success },
  actions: { flexDirection: 'row', gap: spacing.md, padding: spacing.md, paddingBottom: 40, borderTopWidth: 1, borderTopColor: colors.border },
  declineButton: { flex: 1, height: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  declineText: { fontSize: 16, fontWeight: '600', color: colors.foreground },
  acceptButton: { flex: 2, height: 52, borderRadius: radius.md, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  acceptText: { fontSize: 16, fontWeight: '600', color: colors.primaryForeground },
})