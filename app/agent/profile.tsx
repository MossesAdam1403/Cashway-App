import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import AgentNavigation from '../../components/cashway/agent-navigation'
import { colors, spacing, radius, typography } from '../../constants/theme'

const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

export default function AgentProfile() {
  const router = useRouter()

  // TODO: fetch from backend using JWT token
  const agent = {
    firstName: 'James',
    lastName: 'Mwangi',
    phone: '+255 712 345 678',
    email: 'james@gmail.com',
    regNumber: 'NIT/2021/00123',
    mobileMoneyPhone: '0712345678',
    mobileMoneyProvider: 'M-Pesa',
    campus: 'NIT Campus',
    joinedAt: 'January 2025',
    totalDeliveries: 47,
    totalEarned: 56400,
    rating: 4.8,
    status: 'approved',
  }

  const handleSignOut = () => {
    // TODO: clear JWT token
    router.replace('/login')
  }

  return (
    <View style={styles.screen}>
      <AgentNavigation />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.foreground} />
          </View>
          <Text style={styles.name}>{agent.firstName} {agent.lastName}</Text>
          <Text style={styles.phone}>{agent.phone}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.ratingText}>{agent.rating} · {agent.totalDeliveries} deliveries</Text>
          </View>
          <View style={styles.approvedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={styles.approvedText}>Verified Agent — {agent.campus}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{agent.totalDeliveries}</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{formatTSH(agent.totalEarned)}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>⭐ {agent.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
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
              <Text style={styles.detailValue}>{agent.firstName} {agent.lastName}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="phone-portrait-outline" size={18} color={colors.mutedForeground} />
                <Text style={styles.detailLabel}>Phone</Text>
              </View>
              <Text style={styles.detailValue}>{agent.phone}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="school-outline" size={18} color={colors.mutedForeground} />
                <Text style={styles.detailLabel}>Reg Number</Text>
              </View>
              <Text style={styles.detailValue}>{agent.regNumber}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="phone-portrait-outline" size={18} color={colors.mutedForeground} />
                <Text style={styles.detailLabel}>Mobile Money</Text>
              </View>
              <Text style={styles.detailValue}>{agent.mobileMoneyPhone} · {agent.mobileMoneyProvider}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="location-outline" size={18} color={colors.mutedForeground} />
                <Text style={styles.detailLabel}>Campus</Text>
              </View>
              <Text style={styles.detailValue}>{agent.campus}</Text>
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  approvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  approvedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
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
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
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
    fontSize: 13,
    color: colors.mutedForeground,
    maxWidth: '50%',
    textAlign: 'right',
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