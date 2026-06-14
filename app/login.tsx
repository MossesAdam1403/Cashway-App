import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Button } from '../components/cashway/button'
import { Input } from '../components/cashway/input'
import { Card } from '../components/cashway/card'
import { colors, spacing, typography, radius } from '../constants/theme'
import { Ionicons } from '@expo/vector-icons'

export default function Login() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={16} color={colors.mutedForeground} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="flash" size={28} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
          onPress={() => setActiveTab('phone')}
        >
          <Ionicons
            name="phone-portrait-outline"
            size={16}
            color={activeTab === 'phone' ? colors.foreground : colors.mutedForeground}
          />
          <Text style={[styles.tabText, activeTab === 'phone' && styles.activeTabText]}>
            Phone
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'email' && styles.activeTab]}
          onPress={() => setActiveTab('email')}
        >
          <Ionicons
            name="mail-outline"
            size={16}
            color={activeTab === 'email' ? colors.foreground : colors.mutedForeground}
          />
          <Text style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>
            Email
          </Text>
        </TouchableOpacity>
      </View>

      {/* Phone Form */}
      {activeTab === 'phone' && (
        <View style={styles.form}>
          {!otpSent ? (
            <>
              <Input
                label="Phone Number"
                placeholder="+255 712 345 678"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <Button
                label={loading ? 'Processing...' : 'Send Code'}
                onPress={() => setOtpSent(true)}
                fullWidth
                loading={loading}
              />
            </>
          ) : (
            <>
              <Text style={styles.otpInstruction}>
                Enter the code sent to {phone}
              </Text>
              <Input
                label="Verification Code"
                placeholder="000000"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />
              <Button
                label="Verify"
                onPress={() => router.replace('/home')}
                fullWidth
              />
              <Button
                label="Change Number"
                onPress={() => setOtpSent(false)}
                variant="outline"
                fullWidth
              />
            </>
          )}
        </View>
      )}

      {/* Email Form */}
      {activeTab === 'email' && (
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            label={loading ? 'Signing in...' : 'Sign In'}
            onPress={() => router.replace('/home')}
            fullWidth
            loading={loading}
          />
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text
            style={styles.footerLink}
            onPress={() => router.push('/register')}
          >
            Sign up
          </Text>
        </Text>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingTop: 56,
    paddingBottom: spacing.xl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  backText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 64,
    height: 64,
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
  title: {
    ...typography.heading2,
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.small,
    color: colors.mutedForeground,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    gap: spacing.xs,
  },
  activeTab: {
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.foreground,
    fontWeight: '600',
  },
  form: {
    gap: spacing.md,
  },
  otpInstruction: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  footerLink: {
    color: colors.foreground,
    fontWeight: '500',
  },
})