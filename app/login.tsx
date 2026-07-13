import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { Button } from '../components/cashway/button'
import { Input } from '../components/cashway/input'
import { colors, spacing, typography, radius } from '../constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { registerForPushNotifications } from "../config/notification";
import { saveAuthData } from '../utils/auth'

export default function Login() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!phone || !password) {
      setError('Please enter your phone number and password')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('https://cashway-app.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          password,
          deviceToken: await registerForPushNotifications()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Invalid phone number or password')
        setLoading(false)
        return
      }


      // Inside handleLogin after successful response:
      await saveAuthData(data.token, data.user.role, data.user)

      const deviceToken = await registerForPushNotifications()

      if (data.user.role === 'agent') {
        router.replace('/agent/home')
      } else {
        router.replace('/home')
      }

    } catch (err) {
      setError('Connection failed. Please check your internet and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >



      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="flash" size={28} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Input
          label="Phone Number"
          placeholder="+255 712 345 678"
          value={phone}
          onChangeText={(text) => {
            setPhone(text)
            setError('')
          }}
          keyboardType="phone-pad"
        />
        <Input
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={(text) => {
            setPassword(text)
            setError('')
          }}
          secureTextEntry
        />

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Button
          label={loading ? 'Signing in...' : 'Sign In'}
          onPress={handleLogin}
          fullWidth
          loading={loading}
        />
      </View>

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