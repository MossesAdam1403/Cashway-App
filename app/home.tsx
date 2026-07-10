// 
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import { colors, spacing, typography, radius } from '../constants/theme'
import Navigation from '../components/cashway/navigation'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      const raw = await SecureStore.getItemAsync('userData')
      if (raw) {
        const user = JSON.parse(raw)
        setFirstName(user.firstName || '')
      }
    }
    loadUser()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Navigation />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>
            {getGreeting()}{firstName ? `, ${firstName}` : ''}
          </Text>
          <Text style={styles.greetingQuestion}>Need cash today?</Text>
        </View>

        {/* Main CTA Card */}
        <View style={styles.ctaCard}>
          <View style={styles.ctaTop}>
            <View style={styles.ctaIconContainer}>
              <Ionicons name="cash-outline" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.ctaText}>
              <Text style={styles.ctaTitle}>Request Cash</Text>
              <Text style={styles.ctaSubtitle}>
                A nearby agent delivers cash straight to you
              </Text>
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
        <Text style={styles.sectionHeader}>QUICK ACCESS</Text>

        <TouchableOpacity
          style={styles.quickItem}
          onPress={() => router.push('/my-orders')}
        >
          <View style={styles.quickIcon}>
            <Ionicons name="receipt-outline" size={20} color={colors.foreground} />
          </View>
          <View style={styles.quickText}>
            <Text style={styles.quickTitle}>My Orders</Text>
            <Text style={styles.quickSubtitle}>View your cash delivery history</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickItem}
          onPress={() => router.push('/profile')}
        >
          <View style={styles.quickIcon}>
            <Ionicons name="person-outline" size={20} color={colors.foreground} />
          </View>
          <View style={styles.quickText}>
            <Text style={styles.quickTitle}>My Profile</Text>
            <Text style={styles.quickSubtitle}>Account details and settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickItem}
          onPress={() => router.push('/support')}
        >
          <View style={styles.quickIcon}>
            <Ionicons name="help-circle-outline" size={20} color={colors.foreground} />
          </View>
          <View style={styles.quickText}>
            <Text style={styles.quickTitle}>Help & Support</Text>
            <Text style={styles.quickSubtitle}>Get help or report a problem</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>

        {/* Security Badge */}
        <View style={styles.securityBadge}>
          <Ionicons name="shield-checkmark-outline" size={14} color={colors.mutedForeground} />
          <Text style={styles.securityText}>Every delivery secured with OTP verification</Text>
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
    paddingTop: 60,
    paddingBottom: 120,
    gap: spacing.sm,
  },
  greetingSection: {
    paddingLeft: 37,
    marginBottom: spacing.sm,
    gap: 3,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.mutedForeground,
  },
  greetingQuestion: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.foreground,
    letterSpacing: -0.3,
  },
  ctaCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  ctaTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
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
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  ctaButtonText: {
    color: colors.primaryForeground,
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
    letterSpacing: 1,
    paddingLeft: spacing.xs,
    marginBottom: spacing.xs,
  },
  quickItem: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
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
    fontSize: 14,
    fontWeight: '600',
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
    paddingVertical: spacing.lg,
  },
  securityText: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
})