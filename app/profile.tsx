import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Navigation from '../components/cashway/navigation'
import { colors, spacing, radius, typography } from '../constants/theme'

export default function Profile() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // TODO: fetch from backend using JWT token
  const user = {
    fullName: 'Moses Adam',
    phone: '+255 712 345 678',
    email: 'moses@gmail.com',
    joinedAt: 'January 2025',
    totalOrders: 12,
    totalSpent: 245000,
  }

  const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

  const handleSignOut = () => {
    // TODO: clear JWT token
    router.replace('/login')
  }

  return (
    <View style={styles.screen}>
      <Navigation />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.foreground} />
          </View>
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.phone}>{user.phone}</Text>
          <Text style={styles.joined}>Member since {user.joinedAt}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{user.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{formatTSH(user.totalSpent)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>

        {/* Account Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT DETAILS</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="person-outline" size={18} color={colors.mutedForeground} />
                <Text style={styles.detailLabel}>Full Name</Text>
              </View>
              <Text style={styles.detailValue}>{user.fullName}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="phone-portrait-outline" size={18} color={colors.mutedForeground} />
                <Text style={styles.detailLabel}>Phone</Text>
              </View>
              <Text style={styles.detailValue}>{user.phone}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} />
                <Text style={styles.detailLabel}>Email</Text>
              </View>
              <Text style={styles.detailValue}>{user.email || 'Not set'}</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
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

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

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
  profileHeader: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.heading2,
    color: colors.foreground,
  },
  phone: {
    fontSize: 15,
    color: colors.mutedForeground,
  },
  joined: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  statCard: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
  },
  statLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
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
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.error,
  },
})