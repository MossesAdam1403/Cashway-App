import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Navigation from '../components/cashway/navigation'
import { colors, spacing, radius, typography } from '../constants/theme'

const TAGS = ['Fast', 'Friendly', 'Professional', 'Careful']

export default function Rating() {
  const router = useRouter()
  const { amount, agentName, total } = useLocalSearchParams()
  const [stars, setStars] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async () => {
    if (stars === 0) return
    setLoading(true)

    try {
      // TODO: connect to backend
      // await fetch('https://cashway-app.onrender.com/api/ratings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ stars, tags: selectedTags, comment, agentName, amount })
      // })

      await new Promise(resolve => setTimeout(resolve, 1000))

      router.replace({
        pathname: '/done',
        params: { amount, agentName, total }
      })

    } catch (err) {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    router.replace({
      pathname: '/done',
      params: { amount, agentName, total }
    })
  }

  return (
    <View style={styles.screen}>
      <Navigation />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="star-outline" size={36} color={colors.foreground} />
          </View>
          <Text style={styles.title}>Rate your agent</Text>
          <Text style={styles.subtitle}>
            How was your experience with {agentName}?
          </Text>
        </View>

        {/* Stars */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setStars(star)}
              style={styles.starButton}
            >
              <Ionicons
                name={star <= stars ? 'star' : 'star-outline'}
                size={40}
                color={star <= stars ? '#F59E0B' : colors.border}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Star Label */}
        {stars > 0 && (
          <Text style={styles.starLabel}>
            {stars === 1 && 'Poor'}
            {stars === 2 && 'Fair'}
            {stars === 3 && 'Good'}
            {stars === 4 && 'Great'}
            {stars === 5 && 'Excellent!'}
          </Text>
        )}

        {/* Quick Tags */}
        <View style={styles.tagsContainer}>
          <Text style={styles.tagsLabel}>What stood out?</Text>
          <View style={styles.tagsRow}>
            {TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag)
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tag, isSelected && styles.tagSelected]}
                  onPress={() => toggleTag(tag)}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={13} color={colors.primaryForeground} />
                  )}
                  <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Comment */}
        <View style={styles.commentContainer}>
          <Text style={styles.commentLabel}>Add a comment (optional)</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Tell us more about your experience..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={colors.mutedForeground}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, stars === 0 && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={stars === 0 || loading}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.primaryForeground} />
          <Text style={styles.submitText}>
            {loading ? 'Submitting...' : 'Submit Rating'}
          </Text>
        </TouchableOpacity>

        {/* Skip */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>

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
    padding: spacing.lg,
    paddingBottom: 80,
    gap: spacing.lg,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 72,
    height: 72,
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
  },
  starsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  starButton: {
    padding: spacing.xs,
  },
  starLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
    textAlign: 'center',
  },
  tagsContainer: {
    width: '100%',
    gap: spacing.sm,
  },
  tagsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  tagSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  tagTextSelected: {
    color: colors.primaryForeground,
  },
  commentContainer: {
    width: '100%',
    gap: spacing.xs,
  },
  commentLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  commentInput: {
    height: 100,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    fontSize: 15,
    color: colors.foreground,
    backgroundColor: colors.card,
  },
  submitButton: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    width: '100%',
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitText: {
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