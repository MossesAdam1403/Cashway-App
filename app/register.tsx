import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { Button } from '../components/cashway/button'
import { Input } from '../components/cashway/input'
import { colors, spacing, typography, radius } from '../constants/theme'
import { Ionicons } from '@expo/vector-icons'

export default function Register() {
  const router = useRouter()
  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState('')

  const handleSubmit = async () => {
    if (!fullName || !phone || !password) return
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    setPasswordError('')
    setError('')
    setLoading(true)

    const nameParts = fullName.trim().split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || firstName

    try {
      const response = await fetch('https://cashway-app.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          email: email || undefined,
          password,
          role: 'customer'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Could not create account. Please try again.')
        setLoading(false)
        return
      }

      setUserId(data.userId)
      setStep('otp')

    } catch (err) {
      setError('Connection failed. Please check your internet and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) return
    setError('')
    setLoading(true)

    try {
      const response = await fetch('https://cashway-app.onrender.com/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Invalid code. Please try again.')
        setLoading(false)
        return
      }

      await SecureStore.setItemAsync('userToken', data.token)
      await SecureStore.setItemAsync('userRole', data.user.role)
      await SecureStore.setItemAsync('userData', JSON.stringify(data.user))

      router.replace('/home')

    } catch (err) {
      setError('Connection failed. Please check your internet and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="flash" size={28} color="#FFFFFF" />
        </View>
        {step === 'details' ? (
          <>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join CashWay today</Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>Verify Phone</Text>
            <Text style={styles.subtitle}>Code sent to {phone}</Text>
          </>
        )}
      </View>

      {/* Step 1 - Details */}
      {step === 'details' && (
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Moses Adam"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          <Input
            label="Phone Number"
            placeholder="+255 700 000 000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Input
            label="Email (optional)"
            placeholder="cashway@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text)
              setPasswordError('')
            }}
            secureTextEntry
          />
          <Input
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text)
              setPasswordError('')
            }}
            secureTextEntry
          />

          {passwordError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
              <Text style={styles.errorText}>{passwordError}</Text>
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Button
            label={loading ? 'Creating account...' : 'Create Account'}
            onPress={handleSubmit}
            fullWidth
            loading={loading}
          />
        </View>
      )}

      {/* Step 2 - OTP */}
      {step === 'otp' && (
        <View style={styles.form}>
          <View style={styles.otpInfo}>
            <Ionicons name="shield-checkmark-outline" size={40} color={colors.foreground} />
            <Text style={styles.otpTitle}>Enter verification code</Text>
            <Text style={styles.otpSubtitle}>
              We sent a 6-digit code to {phone}
            </Text>
          </View>

          <Input
            label="Verification Code"
            placeholder="000000"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
          />

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Button
            label={loading ? 'Verifying...' : 'Verify & Continue'}
            onPress={handleVerifyOtp}
            fullWidth
            loading={loading}
          />

          <TouchableOpacity style={styles.resendButton}>
            <Text style={styles.resendText}>
              Didn't receive code?{' '}
              <Text style={styles.resendLink}>Resend</Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer */}
      {step === 'details' && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.footerLink} onPress={() => router.push('/login')}>
              Sign in
            </Text>
          </Text>
        </View>
      )}

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
  form: {
    gap: spacing.md,
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
  otpInfo: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  otpTitle: {
    ...typography.heading3,
    color: colors.foreground,
  },
  otpSubtitle: {
    ...typography.small,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  resendText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  resendLink: {
    color: colors.foreground,
    fontWeight: '600',
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