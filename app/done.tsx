// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
// import { useRouter, useLocalSearchParams } from 'expo-router'
// import { useEffect } from 'react'
// import { Ionicons } from '@expo/vector-icons'
// import { colors, spacing, radius, typography } from '../constants/theme'

// const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

// export default function Done() {
//   const router = useRouter()
//   const { amount, agentName, total } = useLocalSearchParams()

//   // Auto return to home after 4 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       router.replace('/home')
//     }, 4000)
//     return () => clearTimeout(timer)
//   }, [])

//   return (
//     <View style={styles.screen}>
//       <View style={styles.container}>

//         {/* Success Icon */}
//         <View style={styles.successIcon}>
//           <Ionicons name="checkmark" size={52} color={colors.primaryForeground} />
//         </View>

//         {/* Title */}
//         <Text style={styles.title}>Thank you!</Text>
//         <Text style={styles.subtitle}>
//           Your cash was delivered{'\n'}successfully
//         </Text>

//         {/* Receipt Card */}
//         <View style={styles.receiptCard}>
//           <View style={styles.receiptRow}>
//             <Text style={styles.receiptLabel}>Amount Collected</Text>
//             <Text style={styles.receiptValue}>{formatTSH(Number(amount))}</Text>
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.receiptRow}>
//             <Text style={styles.receiptLabel}>Total Paid</Text>
//             <Text style={styles.receiptValue}>{formatTSH(Number(total))}</Text>
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.receiptRow}>
//             <Text style={styles.receiptLabel}>Delivered by</Text>
//             <Text style={styles.receiptValue}>{agentName}</Text>
//           </View>
//         </View>

//         {/* Auto redirect note */}
//         <Text style={styles.redirectNote}>
//           Returning to home in a moment...
//         </Text>

//         {/* Manual Home Button */}
//         <TouchableOpacity
//           style={styles.homeButton}
//           onPress={() => router.replace('/home')}
//         >
//           <Ionicons name="home-outline" size={18} color={colors.primaryForeground} />
//           <Text style={styles.homeText}>Back to Home</Text>
//         </TouchableOpacity>

//       </View>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: spacing.lg,
//     gap: spacing.lg,
//   },
//   successIcon: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: colors.success,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     ...typography.heading1,
//     color: colors.foreground,
//     textAlign: 'center',
//   },
//   subtitle: {
//     ...typography.body,
//     color: colors.mutedForeground,
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   receiptCard: {
//     backgroundColor: colors.card,
//     borderRadius: radius.xl,
//     padding: spacing.lg,
//     borderWidth: 1,
//     borderColor: colors.border,
//     width: '100%',
//     gap: spacing.md,
//   },
//   receiptRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   receiptLabel: {
//     fontSize: 14,
//     color: colors.mutedForeground,
//   },
//   receiptValue: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: colors.foreground,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: colors.border,
//   },
//   redirectNote: {
//     fontSize: 13,
//     color: colors.mutedForeground,
//     textAlign: 'center',
//   },
//   homeButton: {
//     height: 52,
//     borderRadius: radius.md,
//     backgroundColor: colors.primary,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: spacing.sm,
//     width: '100%',
//   },
//   homeText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.primaryForeground,
//   },
// })

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, radius, typography } from '../constants/theme'

const formatTSH = (amount: number) => `TSH ${amount.toLocaleString()}`

export default function Done() {
  const router = useRouter()
  const { requestId, amount, agentName, total } = useLocalSearchParams()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home')
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const shortOrderId = requestId
    ? `CW-${String(requestId).slice(-6).toUpperCase()}`
    : '—'

  return (
    <View style={styles.screen}>
      <View style={styles.container}>

        {/* Success Icon */}
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={52} color={colors.primaryForeground} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Cash Delivered!</Text>
        <Text style={styles.subtitle}>
          Your cash was delivered{'\n'}successfully
        </Text>

        {/* Receipt Card */}
        <View style={styles.receiptCard}>

          {/* Order ID */}
          <View style={styles.orderIdRow}>
            <Ionicons name="receipt-outline" size={14} color={colors.mutedForeground} />
            <Text style={styles.orderId}>Order {shortOrderId}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Amount Collected</Text>
            <Text style={styles.receiptValue}>{formatTSH(Number(amount))}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Total Paid</Text>
            <Text style={styles.receiptValue}>{formatTSH(Number(total))}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Delivered by</Text>
            <Text style={styles.receiptValue}>{agentName}</Text>
          </View>

        </View>

        {/* Note */}
        <Text style={styles.redirectNote}>
          This order will appear in your order history
        </Text>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace('/home')}
        >
          <Ionicons name="home-outline" size={18} color={colors.primaryForeground} />
          <Text style={styles.homeText}>Back to Home</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.lg },
  successIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.heading1, color: colors.foreground, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.mutedForeground, textAlign: 'center', lineHeight: 24 },
  receiptCard: { backgroundColor: colors.card, borderRadius: radius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, width: '100%', gap: spacing.md },
  orderIdRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  orderId: { fontSize: 13, fontWeight: '600', color: colors.mutedForeground, letterSpacing: 0.5 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  receiptLabel: { fontSize: 14, color: colors.mutedForeground },
  receiptValue: { fontSize: 14, fontWeight: '700', color: colors.foreground },
  divider: { height: 1, backgroundColor: colors.border },
  redirectNote: { fontSize: 13, color: colors.mutedForeground, textAlign: 'center' },
  homeButton: { height: 52, borderRadius: radius.md, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, width: '100%' },
  homeText: { fontSize: 16, fontWeight: '600', color: colors.primaryForeground },
})