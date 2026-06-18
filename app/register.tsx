
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Button } from '../components/cashway/button'
import { Input } from '../components/cashway/input'
import { colors, spacing, typography, radius } from '../constants/theme'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'

const detectProvider = (phone: string) => {
  if (phone.length < 4) return null
  const prefix = phone.substring(1, 3)
  if (['74', '75', '76'].includes(prefix)) return 'M-Pesa'
  if (['65', '67', '71'].includes(prefix)) return 'Mixx by Yas'
  if (['68', '69', '78'].includes(prefix)) return 'Airtel Money'
  if (['61', '62'].includes(prefix)) return 'HaloPesa'
  return 'Mobile Money'
}

export default function Register() {
  const router = useRouter()
  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [role, setRole] = useState<'customer' | 'agent'>('customer')

  // Customer fields
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Agent fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [agentPhone, setAgentPhone] = useState('')
  const [regNumber, setRegNumber] = useState('')
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [mobileMoneyPhone, setMobileMoneyPhone] = useState('')
  const [agentPassword, setAgentPassword] = useState('')
  const [agentConfirmPassword, setAgentConfirmPassword] = useState('')
  const [agentPasswordError, setAgentPasswordError] = useState('')
  const [floatConfirmed, setFloatConfirmed] = useState(false)

  // OTP
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const detectedProvider = detectProvider(mobileMoneyPhone)

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) return

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri)
    }
  }

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) return

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri)
    }
  }

  const handleSubmitCustomer = () => {
    if (!fullName || !phone || !password) return
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    setPasswordError('')
    setStep('otp')
  }

  const handleSubmitAgent = () => {
    if (!firstName || !lastName || !agentPhone || !regNumber || !mobileMoneyPhone || !agentPassword) return
    if (agentPassword !== agentConfirmPassword) {
      setAgentPasswordError('Passwords do not match')
      return
    }
    if (!floatConfirmed) return
    setAgentPasswordError('')
    setStep('otp')
  }

  const handleVerifyOtp = () => {
    if (!otp) return
    // TODO: connect to backend OTP verification
    if (role === 'agent') {
      router.replace('/agent/home')
    } else {
      router.replace('/home')
    }
  }

  const getPhoneForOtp = () => {
    return role === 'agent' ? agentPhone : phone
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => step === 'otp' ? setStep('details') : router.back()}
      >
        <Ionicons name="arrow-back" size={16} color={colors.mutedForeground} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

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
            <Text style={styles.subtitle}>Code sent to {getPhoneForOtp()}</Text>
          </>
        )}
      </View>

      {/* Step 1 - Details */}
      {step === 'details' && (
        <View style={styles.form}>

          {/* Role Selection */}
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleButton, role === 'customer' && styles.roleButtonSelected]}
              onPress={() => setRole('customer')}
            >
              <Ionicons
                name="person-outline"
                size={18}
                color={role === 'customer' ? colors.primaryForeground : colors.foreground}
              />
              <Text style={[styles.roleText, role === 'customer' && styles.roleTextSelected]}>
                Customer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === 'agent' && styles.roleButtonSelected]}
              onPress={() => setRole('agent')}
            >
              <Ionicons
                name="bicycle-outline"
                size={18}
                color={role === 'agent' ? colors.primaryForeground : colors.foreground}
              />
              <Text style={[styles.roleText, role === 'agent' && styles.roleTextSelected]}>
                Agent
              </Text>
            </TouchableOpacity>
          </View>

          {/* Customer Form */}
          {role === 'customer' && (
            <>
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
              <Button
                label={loading ? 'Creating account...' : 'Create Account'}
                onPress={handleSubmitCustomer}
                fullWidth
                loading={loading}
              />
            </>
          )}

          {/* Agent Form */}
          {role === 'agent' && (
            <>
              {/* Campus Area Badge */}
              <View style={styles.campusBadge}>
                <Ionicons name="school-outline" size={16} color={colors.foreground} />
                <Text style={styles.campusText}>NIT Campus — National Institute of Transport</Text>
              </View>

              {/* Profile Photo */}
              <View style={styles.photoSection}>
                <Text style={styles.photoLabel}>Profile Photo</Text>
                <View style={styles.photoRow}>
                  {profilePhoto ? (
                    <Image source={{ uri: profilePhoto }} style={styles.photoPreview} />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Ionicons name="person-outline" size={32} color={colors.mutedForeground} />
                    </View>
                  )}
                  <View style={styles.photoButtons}>
                    <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                      <Ionicons name="camera-outline" size={16} color={colors.foreground} />
                      <Text style={styles.photoButtonText}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.photoButton} onPress={handlePickPhoto}>
                      <Ionicons name="image-outline" size={16} color={colors.foreground} />
                      <Text style={styles.photoButtonText}>Choose Photo</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Name Fields */}
              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  <Input
                    label="First Name"
                    placeholder="Moses"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.nameField}>
                  <Input
                    label="Last Name"
                    placeholder="Adam"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <Input
                label="Phone Number"
                placeholder="+255 700 000 000"
                value={agentPhone}
                onChangeText={setAgentPhone}
                keyboardType="phone-pad"
              />

              <Input
                label="University Registration Number"
                placeholder="NIT/2021/00123"
                value={regNumber}
                onChangeText={setRegNumber}
                autoCapitalize="characters"
              />

              {/* Mobile Money */}
              <View style={styles.inputGroup}>
                <Input
                  label="Mobile Money Number"
                  placeholder="0712 345 678"
                  value={mobileMoneyPhone}
                  onChangeText={setMobileMoneyPhone}
                  keyboardType="phone-pad"
                />
                {mobileMoneyPhone.length >= 4 && detectedProvider && (
                  <View style={styles.detectedRow}>
                    <Ionicons name="checkmark-circle-outline" size={13} color={colors.success} />
                    <Text style={styles.detectedText}>
                      Detected: <Text style={styles.detectedProvider}>{detectedProvider}</Text>
                    </Text>
                  </View>
                )}
              </View>

              <Input
                label="Password"
                placeholder="••••••••"
                value={agentPassword}
                onChangeText={(text) => {
                  setAgentPassword(text)
                  setAgentPasswordError('')
                }}
                secureTextEntry
              />
              <Input
                label="Confirm Password"
                placeholder="••••••••"
                value={agentConfirmPassword}
                onChangeText={(text) => {
                  setAgentConfirmPassword(text)
                  setAgentPasswordError('')
                }}
                secureTextEntry
              />

              {agentPasswordError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
                  <Text style={styles.errorText}>{agentPasswordError}</Text>
                </View>
              ) : null}

              {/* Float Confirmation */}
              <TouchableOpacity
                style={styles.floatConfirm}
                onPress={() => setFloatConfirmed(!floatConfirmed)}
              >
                <View style={[styles.checkbox, floatConfirmed && styles.checkboxChecked]}>
                  {floatConfirmed && (
                    <Ionicons name="checkmark" size={14} color={colors.primaryForeground} />
                  )}
                </View>
                <Text style={styles.floatText}>
                  I confirm I have a minimum of TSH 50,000 available to carry for deliveries
                </Text>
              </TouchableOpacity>

              <Button
                label={loading ? 'Creating account...' : 'Register as Agent'}
                onPress={handleSubmitAgent}
                fullWidth
                loading={loading}
              />

              <View style={styles.approvalNote}>
                <Ionicons name="information-circle-outline" size={14} color={colors.mutedForeground} />
                <Text style={styles.approvalText}>
                  Your account will be reviewed by CashWay admin before you can go online
                </Text>
              </View>
            </>
          )}
        </View>
      )}

      {/* Step 2 - OTP */}
      {step === 'otp' && (
        <View style={styles.form}>
          <View style={styles.otpInfo}>
            <Ionicons name="shield-checkmark-outline" size={40} color={colors.foreground} />
            <Text style={styles.otpTitle}>Enter verification code</Text>
            <Text style={styles.otpSubtitle}>
              We sent a 6-digit code to {getPhoneForOtp()}
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
  roleContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleButton: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.card,
  },
  roleButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  roleTextSelected: {
    color: colors.primaryForeground,
  },
  campusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  campusText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.foreground,
    flex: 1,
  },
  photoSection: {
    gap: spacing.sm,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoButtons: {
    flex: 1,
    gap: spacing.sm,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
  },
  photoButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.foreground,
  },
  nameRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  nameField: {
    flex: 1,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  detectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4,
  },
  detectedText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  detectedProvider: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.foreground,
  },
  floatConfirm: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  floatText: {
    fontSize: 13,
    color: colors.foreground,
    flex: 1,
    lineHeight: 20,
  },
  approvalNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  approvalText: {
    fontSize: 12,
    color: colors.mutedForeground,
    flex: 1,
    lineHeight: 18,
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