import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AgentNavigation from '../../components/cashway/agent-navigation'
import { colors, spacing, radius, typography } from '../../constants/theme'

const FAQS = [
  {
    id: '1',
    question: 'How do I receive orders?',
    answer: 'Go online from your dashboard by toggling the online switch. You will automatically receive incoming requests from nearby customers. Make sure your location is enabled.'
  },
  {
    id: '2',
    question: 'When do I need to pay CashWay?',
    answer: 'Your debt accumulates after each delivery. When your debt reaches TSH 5,000 you will be blocked from receiving orders. Pay via CashWay Lipa namba to clear your balance and resume.'
  },
  {
    id: '3',
    question: 'How does the OTP verification work?',
    answer: 'When you arrive at the customer location, ask the customer for their OTP code. Enter it on your device to confirm the cash handover. Never hand over cash before OTP is confirmed.'
  },
  {
    id: '4',
    question: 'What if the customer is not at the location?',
    answer: 'Call or message the customer using the contact buttons on the navigation screen. Wait a reasonable time. If they do not respond, contact CashWay support via WhatsApp.'
  },
  {
    id: '5',
    question: 'How do I handle a quick favour request?',
    answer: 'If a customer has added a quick favour, you will see it on the request screen before accepting. Only accept if you can fulfil the favour on your way. Quick favours are voluntary and free.'
  },
]

export default function AgentSupport() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [problem, setProblem] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/255634991013')
  }

  const handleEmail = () => {
    Linking.openURL('mailto:cashway.officall@gmail.com?subject=Agent Support Request')
  }

  const handleSubmitProblem = async () => {
    if (!problem) return
    setLoading(true)
    // TODO: connect to backend
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setSubmitted(true)
    setProblem('')
  }

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  return (
    <View style={styles.screen}>
      <AgentNavigation />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Help & Support</Text>
          <Text style={styles.pageSubtitle}>Agent support center</Text>
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT US</Text>
          <View style={styles.contactCard}>
            <TouchableOpacity style={styles.contactRow} onPress={handleWhatsApp}>
              <View style={[styles.contactIcon, { backgroundColor: '#25D366' }]}>
                <Ionicons name="logo-whatsapp" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>WhatsApp</Text>
                <Text style={styles.contactSubtitle}>Chat with us directly</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.contactRow} onPress={handleEmail}>
              <View style={[styles.contactIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="mail-outline" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Email</Text>
                <Text style={styles.contactSubtitle}>cashway.officall@gmail.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Response Note */}
        <View style={styles.responseNote}>
          <Ionicons name="time-outline" size={14} color={colors.mutedForeground} />
          <Text style={styles.responseText}>
            We typically respond within 24 hours on weekdays
          </Text>
        </View>

        {/* Report Problem */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REPORT A PROBLEM</Text>
          <View style={styles.reportCard}>
            {submitted ? (
              <View style={styles.submittedState}>
                <Ionicons name="checkmark-circle" size={40} color={colors.success} />
                <Text style={styles.submittedTitle}>Report Submitted</Text>
                <Text style={styles.submittedSubtitle}>
                  We have received your report and will get back to you within 24 hours
                </Text>
                <TouchableOpacity
                  style={styles.anotherButton}
                  onPress={() => setSubmitted(false)}
                >
                  <Text style={styles.anotherButtonText}>Submit Another</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.reportLabel}>Describe your problem</Text>
                <TextInput
                  style={styles.reportInput}
                  placeholder="Tell us what went wrong..."
                  value={problem}
                  onChangeText={setProblem}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  placeholderTextColor={colors.mutedForeground}
                />
                <TouchableOpacity
                  style={[styles.submitButton, !problem && styles.submitButtonDisabled]}
                  onPress={handleSubmitProblem}
                  disabled={!problem || loading}
                >
                  <Ionicons name="send-outline" size={16} color={colors.primaryForeground} />
                  <Text style={styles.submitButtonText}>
                    {loading ? 'Submitting...' : 'Submit Report'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>
          <View style={styles.faqCard}>
            {FAQS.map((faq, index) => (
              <View key={faq.id}>
                <TouchableOpacity
                  style={styles.faqRow}
                  onPress={() => toggleFaq(faq.id)}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons
                    name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={colors.mutedForeground}
                  />
                </TouchableOpacity>
                {expandedFaq === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
                {index < FAQS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
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
    gap: spacing.lg,
  },
  pageHeader: {
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  pageTitle: {
    ...typography.heading2,
    color: colors.foreground,
  },
  pageSubtitle: {
    ...typography.small,
    color: colors.mutedForeground,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
    letterSpacing: 1,
    paddingLeft: spacing.xs,
  },
  contactCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    gap: 2,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.foreground,
  },
  contactSubtitle: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  responseNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  responseText: {
    fontSize: 13,
    color: colors.mutedForeground,
    flex: 1,
  },
  reportCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  reportLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  reportInput: {
    height: 120,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: 14,
    color: colors.foreground,
    backgroundColor: colors.background,
  },
  submitButton: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  submittedState: {
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  submittedTitle: {
    ...typography.heading3,
    color: colors.foreground,
  },
  submittedSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
  },
  anotherButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  anotherButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  faqCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    gap: spacing.md,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    flex: 1,
    lineHeight: 20,
  },
  faqAnswer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  faqAnswerText: {
    fontSize: 13,
    color: colors.mutedForeground,
    lineHeight: 22,
  },
})