import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'

export default function Home() {
  const router = useRouter()

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>⚡</Text>
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
            <Text style={styles.ctaIcon}>⚡</Text>
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
          <Text style={styles.ctaButtonText}>Get Started →</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Access */}
      <View>
        <Text style={styles.sectionHeader}>QUICK ACCESS</Text>
        
        <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/agents')}>
          <View style={styles.quickIcon}>
            <Text>👤</Text>
          </View>
          <View style={styles.quickText}>
            <Text style={styles.quickTitle}>Browse Agents</Text>
            <Text style={styles.quickSubtitle}>View ratings & availability</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/tracking')}>
          <View style={styles.quickIcon}>
            <Text>📍</Text>
          </View>
          <View style={styles.quickText}>
            <Text style={styles.quickTitle}>Track Delivery</Text>
            <Text style={styles.quickSubtitle}>Real-time location updates</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/profile')}>
          <View style={styles.quickIcon}>
            <Text>🕐</Text>
          </View>
          <View style={styles.quickText}>
            <Text style={styles.quickTitle}>Transaction History</Text>
            <Text style={styles.quickSubtitle}>View past deliveries</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Security Badge */}
      <View style={styles.securityBadge}>
        <Text style={styles.securityText}>🛡️ Bank-grade security & encryption</Text>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 32,
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 36,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#141414',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#737373',
  },
  trustGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  trustCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  trustNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#141414',
    letterSpacing: -0.5,
  },
  trustLabel: {
    fontSize: 12,
    color: '#737373',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
  },
  ctaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  ctaIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaIcon: {
    fontSize: 28,
  },
  ctaText: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#141414',
    marginBottom: 4,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: '#737373',
  },
  ctaButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#737373',
    letterSpacing: 1,
    marginBottom: 12,
    paddingLeft: 4,
  },
  quickItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickText: {
    flex: 1,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#141414',
    marginBottom: 2,
  },
  quickSubtitle: {
    fontSize: 12,
    color: '#737373',
  },
  arrow: {
    fontSize: 20,
    color: '#737373',
  },
  securityBadge: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  securityText: {
    fontSize: 12,
    color: '#737373',
    fontWeight: '500',
  },
})