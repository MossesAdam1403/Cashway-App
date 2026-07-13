import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import Navigation from '../components/cashway/navigation'
import { colors, spacing, radius, typography } from '../constants/theme'
import { clearAuthData } from '../utils/auth'

const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const stored = await SecureStore.getItemAsync('userData')
      if (stored) setUser(JSON.parse(stored))

      const token = await SecureStore.getItemAsync('userToken')
      const response = await fetch('https://cashway-app.onrender.com/api/requests/my-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) setOrders(data.orders || [])
    } catch (err) {
      // Use stored user data even if orders fail
    } finally {
      setLoading(false)
    }
  }



  const handleSignOut = async () => {
    await clearAuthData()
    router.replace('/login')
  }
  const completedOrders = orders.filter(o => o.status === 'completed')
  const totalSpent = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0)

  if (loading) {
    return (
      <View style={styles.screen}>
        <Navigation />
        <View style={styles.loadingState}>
          <ActivityIndicator color={colors.foreground} size="large" />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      <Navigation />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.foreground} />
          </View>
          <Text style={styles.name}>
            {user ? `${user.firstName} ${user.lastName}` : '—'}
          </Text>
          <Text style={styles.phone}>{user?.phone || '—'}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedOrders.length}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{formatTSH(totalSpent)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT DETAILS</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="person-outline" size={18} color={colors.mutedForeground} />
                <Text style={styles.detailLabel}>Full Name</Text>
              </View>
              <Text style={styles.detailValue}>
                {user ? `${user.firstName} ${user.lastName}` : '—'}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="phone-portrait-outline" size={18} color={colors.mutedForeground} />
                <Text style={styles.detailLabel}>Phone</Text>
              </View>
              <Text style={styles.detailValue}>{user?.phone || '—'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          <View style={styles.detailsCard}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} />
                <Text style={styles.detailLabel}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="notifications-outline" size={18} color={colors.mutedForeground} />
                <Text style={styles.detailLabel}>Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.agentLink}
          onPress={() => router.push('/agent-register')}
        >
          <View style={styles.agentLinkIcon}>
            <Ionicons name="bicycle-outline" size={20} color={colors.foreground} />
          </View>
          <View style={styles.agentLinkContent}>
            <Text style={styles.agentLinkTitle}>Become a CashWay Agent</Text>
            <Text style={styles.agentLinkSubtitle}>Earn by delivering cash on campus</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 80, gap: spacing.lg },
  loadingState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  profileHeader: { alignItems: 'center', paddingTop: spacing.lg, gap: spacing.sm },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.muted, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  name: { ...typography.heading2, color: colors.foreground },
  phone: { fontSize: 15, color: colors.mutedForeground },
  statsRow: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  statCard: { flex: 1, padding: spacing.lg, alignItems: 'center', gap: spacing.xs },
  statDivider: { width: 1, backgroundColor: colors.border },
  statNumber: { fontSize: 18, fontWeight: '700', color: colors.foreground },
  statLabel: { fontSize: 12, color: colors.mutedForeground },
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: colors.mutedForeground, letterSpacing: 1, paddingLeft: spacing.xs },
  detailsCard: { backgroundColor: colors.card, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  detailLabel: { fontSize: 14, color: colors.foreground, fontWeight: '500' },
  detailValue: { fontSize: 14, color: colors.mutedForeground },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.md },
  agentLink: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.card, borderRadius: radius.xl, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  agentLinkIcon: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.muted, alignItems: 'center', justifyContent: 'center' },
  agentLinkContent: { flex: 1, gap: 2 },
  agentLinkTitle: { fontSize: 15, fontWeight: '600', color: colors.foreground },
  agentLinkSubtitle: { fontSize: 12, color: colors.mutedForeground },
  signOutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: 52, borderRadius: radius.md, borderWidth: 1, borderColor: '#FECACA', backgroundColor: '#FEF2F2' },
  signOutText: { fontSize: 15, fontWeight: '600', color: colors.error },
})