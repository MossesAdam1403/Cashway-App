import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, radius, typography } from '../constants/theme'

const { width, height } = Dimensions.get('window')

const SCREENS = [
  {
    icon: 'bicycle-outline',
    title: 'Earn on Every Delivery',
    subtitle: 'Accept cash requests near you, deliver to the customer, and earn TSH 800 per delivery. Work when you want.',
  },
  {
    icon: 'cash-outline',
    title: 'You Need TSH 50,000 to Start',
    subtitle: 'You carry cash from your own pocket. Customer pays you back the full amount plus your delivery fee when you arrive.',
  },
  {
    icon: 'warning-outline',
    title: 'CashWay Takes a Small Cut',
    subtitle: 'After each delivery CashWay deducts 3% of the cash amount plus TSH 200 from your earnings. Once your total debt hits TSH 5,000 orders stop until you pay via Lipa namba.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Every Handover is Protected',
    subtitle: 'You only hand over cash when the customer shows you their OTP code. No code — keep the cash and report it to CashWay immediately.',
  },
]

export default function AgentOnboarding() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

  const isLast = currentIndex === SCREENS.length - 1
  const screen = SCREENS[currentIndex]

  const handleContinue = () => {
    if (isLast) {
      router.replace('/agent-register')
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentIndex === 0) {
      router.back()
    } else {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleMaybeLater = () => {
    router.back()
  }

  return (
    <View style={styles.screen}>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={20} color={colors.mutedForeground} />
      </TouchableOpacity>

      {/* Icon Section */}
      <View style={styles.iconSection}>
        <View style={styles.iconOuterRing}>
          <View style={styles.iconInnerRing}>
            <View style={[
              styles.iconContainer,
              currentIndex === 2 && styles.iconContainerWarning
            ]}>
              <Ionicons
                name={screen.icon as any}
                size={64}
                color={colors.primaryForeground}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{screen.title}</Text>
        <Text style={styles.subtitle}>{screen.subtitle}</Text>
      </View>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SCREENS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
              index < currentIndex && styles.dotPast,
            ]}
          />
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>
            {isLast ? 'I Understand — Apply Now' : 'Continue'}
          </Text>
          <Ionicons
            name={isLast ? 'checkmark-circle-outline' : 'arrow-forward'}
            size={18}
            color={colors.primaryForeground}
          />
        </TouchableOpacity>

        {!isLast && (
          <TouchableOpacity style={styles.laterButton} onPress={handleMaybeLater}>
            <Text style={styles.laterText}>Maybe Later</Text>
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
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOuterRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInnerRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  iconContainerWarning: {
    backgroundColor: '#92400E',
  },
  content: {
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.foreground,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: colors.mutedForeground,
    lineHeight: 26,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dotPast: {
    backgroundColor: colors.mutedForeground,
  },
  actions: {
    gap: spacing.md,
  },
  continueButton: {
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  laterButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  laterText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
})