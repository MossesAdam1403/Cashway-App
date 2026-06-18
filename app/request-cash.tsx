import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import Navigation from '../components/cashway/navigation'
import { colors, spacing, radius, typography } from '../constants/theme'

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000, 75000, 100000]

const formatTSH = (amount: number) => {
  return `TSH ${amount.toLocaleString()}`
}

export default function RequestCash() {
  const router = useRouter()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getFinalAmount = () => {
    if (customAmount) return parseInt(customAmount.replace(/,/g, '')) || 0
    return selectedAmount || 0
  }

  const handleQuickAmount = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount(amount.toString())
    setError('')
  }

  const handleCustomInput = (text: string) => {
    setCustomAmount(text)
    setSelectedAmount(null)
    setError('')
  }

  const handleFindAgent = async () => {
    const amount = getFinalAmount()

    if (amount < 1000) {
      setError('Minimum amount is TSH 1,000')
      return
    }

    if (amount > 100000) {
      setError('Maximum amount is TSH 100,000 for now')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setError('Location access is needed to find agents near you')
        setLoading(false)
        return
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })

      const { latitude, longitude } = location.coords

      router.push({
        pathname: '/finding-agent',
        params: {
          amount,
          lat: latitude,
          lng: longitude,
        },
      })

    } catch (err) {
      setError('Could not get your location. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const finalAmount = getFinalAmount()
  const isValid = finalAmount >= 1000 && finalAmount <= 100000

  return (
    <View style={styles.screen}>
      <Navigation />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Page Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Request Cash Delivery</Text>
          <Text style={styles.pageSubtitle}>Fast, secure cash delivery to your location</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>

          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="cash-outline" size={32} color={colors.foreground} />
            </View>
            <Text style={styles.cardTitle}>How much do you need?</Text>
            <Text style={styles.cardSubtitle}>Choose or enter your amount</Text>
          </View>

          {/* Quick Amount Buttons — 6 buttons 2x3 grid */}
          <View style={styles.amountGrid}>
            {QUICK_AMOUNTS.map((amount) => {
              const isSelected = selectedAmount === amount
              return (
                <TouchableOpacity
                  key={amount}
                  style={[styles.amountButton, isSelected && styles.amountButtonSelected]}
                  onPress={() => handleQuickAmount(amount)}
                >
                  {/* <Ionicons
                    name="banknote-outline"
                    size={15}
                    color={isSelected ? colors.primaryForeground : colors.foreground}
                  /> */}
                  <Text style={[styles.amountButtonText, isSelected && styles.amountButtonTextSelected]}>
                    {formatTSH(amount)}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Custom Amount Input — always visible */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Or enter custom amount</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 30,000"
              value={customAmount}
              onChangeText={handleCustomInput}
              keyboardType="number-pad"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>

          {/* Selected Amount Display
          {finalAmount >= 1000 && (
            <View style={styles.selectedDisplay}>
              <Text style={styles.selectedLabel}>Selected Amount</Text>
              <Text style={styles.selectedAmount}>{formatTSH(finalAmount)}</Text>
            </View>
          )} */}

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Find Agent Button */}
          <TouchableOpacity
            style={[styles.findButton, !isValid && styles.findButtonDisabled]}
            onPress={handleFindAgent}
            disabled={!isValid || loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} size="small" />
            ) : (
              <>
                <Ionicons name="search-outline" size={18} color={colors.primaryForeground} />
                <Text style={styles.findButtonText}>Find Nearest Agent</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Info Note */}
          <View style={styles.infoNote}>
            <Ionicons name="location-outline" size={13} color={colors.mutedForeground} />
            <Text style={styles.infoText}>
              Your location will be used automatically to find the closest agent
            </Text>
          </View>

        </View>
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
  },
  pageHeader: {
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  pageTitle: {
    ...typography.heading2,
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  pageSubtitle: {
    ...typography.small,
    color: colors.mutedForeground,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    ...typography.heading2,
    color: colors.foreground,
    textAlign: 'center',
  },
  cardSubtitle: {
    ...typography.small,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  amountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    width: '47%',
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
  },
  amountButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  amountButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.foreground,
  },
  amountButtonTextSelected: {
    color: colors.primaryForeground,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  input: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.foreground,
    backgroundColor: colors.background,
  },
  selectedDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  selectedLabel: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  selectedAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#FEF2F2',
    padding: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
    flex: 1,
  },
  findButton: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  findButtonDisabled: {
    opacity: 0.4,
  },
  findButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  infoText: {
    fontSize: 12,
    color: colors.mutedForeground,
    flex: 1,
    lineHeight: 18,
  },
})