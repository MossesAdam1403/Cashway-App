import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { Ionicons } from '@expo/vector-icons'
import Navigation from '../components/cashway/navigation'
import { colors, spacing, radius, typography } from '../constants/theme'

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'order': return 'cash-outline'
    case 'system': return 'shield-checkmark-outline'
    case 'alert': return 'alert-circle-outline'
    default: return 'notifications-outline'
  }
}

const getAccentColor = (type: string) => {
  switch (type) {
    case 'order': return '#22C55E'
    case 'alert': return '#EF4444'
    case 'system': return '#3B82F6'
    default: return '#737373'
  }
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString()
}

const isToday = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}



export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchNotifications = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken')
      const response = await fetch(
        'https://cashway-app.onrender.com/api/notifications',
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (err) {
      setError('Could not load notifications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const todayNotifications = notifications.filter(n => isToday(n.createdAt))
  const earlierNotifications = notifications.filter(n => !isToday(n.createdAt))
  const unreadCount = notifications.filter(n => !n.isRead).length

  const renderNotification = ({ item }: { item: any }) => {
    const accent = getAccentColor(item.type)

    return (
      <View style={[
        styles.card,
        !item.isRead && styles.cardUnread,
        { borderLeftColor: accent, borderLeftWidth: 3 }
      ]}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: accent + '15' }]}>
          <Ionicons
            name={getNotificationIcon(item.type) as any}
            size={20}
            color={accent}
          />
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <View style={styles.cardTop}>
            <Text style={[
              styles.notificationTitle,
              !item.isRead && styles.notificationTitleUnread
            ]}>
              {item.title}
            </Text>
            {!item.isRead && (
              <View style={[styles.unreadDot, { backgroundColor: accent }]} />
            )}
          </View>
          <Text style={styles.notificationBody}>{item.body}</Text>
          <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
        </View>
      </View>
    )
  }

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator color={colors.foreground} size="large" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      )
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <View style={styles.errorIcon}>
            <Ionicons name="alert-circle" size={36} color="#EF4444" />
          </View>
          <Text style={styles.emptyTitle}>Something went wrong</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchNotifications}>
            <Ionicons name="refresh-outline" size={16} color={colors.primaryForeground} />
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )
    }

    if (notifications.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="notifications-off-outline" size={40} color={colors.mutedForeground} />
          </View>
          <Text style={styles.emptyTitle}>All caught up</Text>
          <Text style={styles.emptySubtitle}>
            Your activity and updates{'\n'}will appear here
          </Text>
        </View>
      )
    }

    return (
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <View style={styles.listContent}>
            {/* Today */}
            {todayNotifications.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>TODAY</Text>
                {todayNotifications.map(item => (
                  <View key={item._id}>
                    {renderNotification({ item })}
                  </View>
                ))}
              </>
            )}

            {/* Earlier */}
            {earlierNotifications.length > 0 && (
              <>
                <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
                  EARLIER
                </Text>
                {earlierNotifications.map(item => (
                  <View key={item._id}>
                    {renderNotification({ item })}
                  </View>
                ))}
              </>
            )}
          </View>
        }
        keyExtractor={() => 'header'}
        showsVerticalScrollIndicator={false}
      />
    )
  }

  return (
    <View style={styles.screen}>
      <Navigation />

      <View style={styles.container}>

        {/* Header */}
        <View style={styles.pageHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.pageTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.pageSubtitle}>Your recent activity</Text>
        </View>

        {renderContent()}

      </View>
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
  pageHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  pageTitle: {
    ...typography.heading2,
    color: colors.foreground,
  },
  unreadBadge: {
    backgroundColor: colors.foreground,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.background,
  },
  pageSubtitle: {
    ...typography.small,
    color: colors.mutedForeground,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 100,
    gap: spacing.sm,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.mutedForeground,
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  cardUnread: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    flex: 1,
  },
  notificationTitleUnread: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    flexShrink: 0,
    marginLeft: spacing.xs,
  },
  notificationBody: {
    fontSize: 13,
    color: colors.mutedForeground,
    lineHeight: 19,
  },
  time: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontWeight: '500',
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: spacing.sm,
  },
  emptyIconContainer: {
    width: 88,
    height: 88,
    borderRadius: radius.xl,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...typography.heading3,
    color: colors.foreground,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 48,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    marginTop: spacing.sm,
  },
  retryText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
})