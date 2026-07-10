import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import { colors, spacing, radius, typography } from '../constants/theme'

const { width, height } = Dimensions.get('window')

const SCREENS = [
  {
    icon: 'cash-outline',
    title: 'No ATM? No Problem.',
    subtitle: 'Request cash from your phone and a nearby agent delivers it straight to you — anywhere in Dar es Salaam',
  },
  {
    icon: 'bag-handle-outline',
    title: 'Cash Plus a Little Extra',
    subtitle: 'Need something small on the way? Ask your agent to grab airtime, snacks, water or anything from a nearby shop. No extra charge.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Only You Can Release Your Cash',
    subtitle: 'Your agent arrives with your cash but hands it over only when you share your secret code. No code, no cash.',
  },
  {
    icon: 'location-outline',
    title: 'Starting in Dar es Salaam',
    subtitle: 'CashWay is live and growing fast across Tanzania — be among the first to experience it',
  },
]

export default function Onboarding() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

  const isLast = currentIndex === SCREENS.length - 1
  const screen = SCREENS[currentIndex]

  const handleContinue = async () => {
    if (isLast) {
      await SecureStore.setItemAsync('onboarding_complete', 'true')
      router.replace('/register')
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleSkip = async () => {
    await SecureStore.setItemAsync('onboarding_complete', 'true')
    router.replace('/register')
  }

  const handleSignIn = async () => {
    await SecureStore.setItemAsync('onboarding_complete', 'true')
    router.replace('/login')
  }

  return (
    <View style={styles.screen}>

      {/* Skip Button */}
      {!isLast && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Icon Section */}
      <View style={styles.iconSection}>
        <View style={styles.iconOuterRing}>
          <View style={styles.iconInnerRing}>
            <View style={styles.iconContainer}>
              <Ionicons name={screen.icon as any} size={64} color={colors.primaryForeground} />
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
            {isLast ? 'Get Started' : 'Continue'}
          </Text>
          <Ionicons
            name={isLast ? 'flash' : 'arrow-forward'}
            size={18}
            color={colors.primaryForeground}
          />
        </TouchableOpacity>

        {isLast && (
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInText}>
              Already have an account?{' '}
              <Text style={styles.signInLink}>Sign in</Text>
            </Text>
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
  skipButton: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.mutedForeground,
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
  signInButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  signInText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  signInLink: {
    color: colors.foreground,
    fontWeight: '600',
  },
}) 