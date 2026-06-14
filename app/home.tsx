import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, typography, radius } from '../constants/theme'
import Navigation from '../components/cashway/navigation'

export default function Home() {
  const router = useRouter()

  return (
  <View style={{ flex: 1 }}>
    <Navigation />
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <Ionicons name="flash" size={36} color="#FFFFFF" />
        </View>
        <Text style={styles.appName}>CashWay</Text>
        <Text style={styles.tagline}>Instant cash delivery, anywhere</Text>
      </View>

      {/* Trust Indicators */}
      <View style={styles.trustGrid}>
        <View style={styles.trustCard}>
          <Text style={styles.trustNumber}>25+</Text>
          <Text style={styles.trustLabel}>Active Agents</Text>
        </View>
        <View style={styles.trustCard}>
          <Text style={styles.trustNumber}>5min</Text>
          <Text style={styles.trustLabel}>Avg. Delivery</Text>
        </View>
        <View style={styles.trustCard}>
          <Text style={styles.trustNumber}>24/7</Text>
          <Text style={styles.trustLabel}>Available</Text>
        </View>
      </View>

      {/* Main CTA Card */}
      <View style={styles.ctaCard}>
        <View style={styles.ctaTop}>
          <View style={styles.ctaIconContainer}>
            <Ionicons name="flash" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.ctaText}>
            <Text style={styles.ctaTitle}>Request Cash</Text>
            <Text style={styles.ctaSubtitle}>Fast, secure delivery to your location</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/request-cash')}
        >
          <Text style={styles.ctaButtonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Quick Access */}
      <View>
        <Text style={styles.sectionHeader}>QUICK ACCESS</Text>

        <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/agents')}>
          <View style={styles.quickIcon}>
            <Ionicons name="person-outline" size={20} color={colors.foreground} />
          </View>
          <View style={styles.quickText}>
            <Text style={styles.quickTitle}>Browse Agents</Text>
            <Text style={styles.quickSubtitle}>View ratings & availability</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/tracking')}>
          <View style={styles.quickIcon}>
            <Ionicons name="location-outline" size={20} color={colors.foreground} />
          </View>
          <View style={styles.quickText}>
            <Text style={styles.quickTitle}>Track Delivery</Text>
            <Text style={styles.quickSubtitle}>Real-time location updates</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/profile')}>
          <View style={styles.quickIcon}>
            <Ionicons name="time-outline" size={20} color={colors.foreground} />
          </View>
          <View style={styles.quickText}>
            <Text style={styles.quickTitle}>Transaction History</Text>
            <Text style={styles.quickSubtitle}>View past deliveries</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      {/* Security Badge */}
      <View style={styles.securityBadge}>
        <Ionicons name="shield-checkmark-outline" size={14} color={colors.mutedForeground} />
        <Text style={styles.securityText}>Bank-grade security & encryption</Text>
      </View>

    </ScrollView>
  </View>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 120,
  },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    ...typography.heading1,
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.body,
    color: colors.mutedForeground,
  },
  trustGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  trustCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  trustNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  trustLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  ctaCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  ctaIconContainer: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    flex: 1,
  },
  ctaTitle: {
    ...typography.heading3,
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  ctaSubtitle: {
    ...typography.small,
    color: colors.mutedForeground,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  ctaButtonText: {
    color: colors.primaryForeground,
    fontSize: 16,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
    letterSpacing: 1,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
  },
  quickItem: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickText: {
    flex: 1,
  },
  quickTitle: {
    ...typography.small,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 2,
  },
  quickSubtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  securityText: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
})