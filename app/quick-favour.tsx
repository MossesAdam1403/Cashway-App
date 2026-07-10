import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import { colors, spacing, radius, typography } from '../constants/theme'

export default function QuickFavour() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [favour, setFavour] = useState('')

  const handleAdd = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken')

      await fetch(`https://cashway-app.onrender.com/api/requests/${params.requestId}/favour`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ favour }),
      })

    } catch (err) {
      // Favour is a nice-to-have, not critical — proceed regardless
    }

    router.push({
      pathname: '/waiting',
      params: { ...params, favour }
    })
  }

  const handleSkip = () => {
    router.push({
      pathname: '/waiting',
      params: { ...params, favour: '' }
    })
  }
  return (
    <Modal
      visible={true}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.sheet}>

            {/* Handle Bar */}
            <View style={styles.handle} />

            {/* Icon */}
            <View style={styles.iconContainer}>
              <Ionicons name="bag-handle-outline" size={32} color={colors.foreground} />
            </View>

            {/* Header */}
            <Text style={styles.title}>Need a quick favour?</Text>
            <Text style={styles.subtitle}>
              Agent can bring small errands like{'\n'}airtime, bread or water.
            </Text>

            {/* Input */}
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="What do you need?"
                value={favour}
                onChangeText={setFavour}
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Add Button */}
            <TouchableOpacity
              style={[styles.addButton, !favour && styles.addButtonDisabled]}
              onPress={handleAdd}
              disabled={!favour}
            >
              <Ionicons name="add-circle-outline" size={18} color={colors.primaryForeground} />
              <Text style={styles.addText}>Add to my delivery</Text>
            </TouchableOpacity>

            {/* Skip */}
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip, no thanks</Text>
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: 40,
    alignItems: 'center',
    gap: spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.heading2,
    color: colors.foreground,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.small,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputGroup: {
    width: '100%',
  },
  input: {
    height: 80,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    fontSize: 15,
    color: colors.foreground,
    backgroundColor: colors.card,
  },
  addButton: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    width: '100%',
  },
  addButtonDisabled: {
    opacity: 0.4,
  },
  addText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  skipButton: {
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
})