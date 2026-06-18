import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, spacing, radius } from '../../constants/theme'

const DRAWER_WIDTH = 300

export default function AgentNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const insets = useSafeAreaInsets()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current

  const openDrawer = () => {
    setDrawerOpen(true)
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start()
  }

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: DRAWER_WIDTH,
      duration: 240,
      useNativeDriver: true,
    }).start(() => setDrawerOpen(false))
  }

  const navItems = [
    { label: 'Dashboard', icon: 'grid-outline', route: '/agent/home' },
    { label: 'My Deliveries', icon: 'bicycle-outline', route: '/agent/deliveries' },
    { label: 'My Earnings', icon: 'wallet-outline', route: '/agent/earnings' },
    { label: 'Profile', icon: 'person-outline', route: '/agent/profile' },
    { label: 'Help & Support', icon: 'help-circle-outline', route: '/agent/support' },
  ]

  const handleNavigate = (route: string) => {
    closeDrawer()
    setTimeout(() => router.push(route as any), 240)
  }

  const handleSignOut = () => {
    closeDrawer()
    setTimeout(() => router.replace('/login'), 240)
  }

  // TODO: replace with real auth state from JWT
  const agent = { name: 'James Mwangi', phone: '+255 712 345 678' }

  return (
    <>
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <Text style={styles.brandName}>CashWay</Text>
        <View style={styles.topBarRight}>
          <View style={styles.agentBadge}>
            <Ionicons name="bicycle-outline" size={13} color={colors.foreground} />
            <Text style={styles.agentBadgeText}>Agent</Text>
          </View>
          <TouchableOpacity style={styles.menuButton} onPress={openDrawer}>
            <Ionicons name="menu" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Drawer */}
      {drawerOpen && (
        <Modal transparent animationType="none" visible={drawerOpen}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={closeDrawer}
          />
          <Animated.View
            style={[
              styles.drawer,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            {/* Drawer Header */}
            <View style={[styles.drawerHeader, { paddingTop: insets.top + 16 }]}>
              <Text style={styles.drawerBrand}>CashWay</Text>
              <Text style={styles.drawerSubtitle}>Agent Menu</Text>
            </View>

            <View style={styles.divider} />

            {/* Nav Items */}
            <View style={styles.navItems}>
              {navItems.map((item) => {
                const isActive = pathname === item.route
                return (
                  <TouchableOpacity
                    key={item.route + item.label}
                    style={[styles.navItem, isActive && styles.navItemActive]}
                    onPress={() => handleNavigate(item.route)}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={isActive ? colors.primaryForeground : colors.foreground}
                    />
                    <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                      {item.label}
                    </Text>
                    {isActive && (
                      <Ionicons
                        name="arrow-forward"
                        size={16}
                        color={colors.primaryForeground}
                      />
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>

            <View style={styles.divider} />

            {/* Bottom Section */}
            <View style={styles.drawerBottom}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Ionicons name="person" size={18} color={colors.foreground} />
                </View>
                <View>
                  <Text style={styles.userName}>{agent.name}</Text>
                  <Text style={styles.userPhone}>{agent.phone}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Ionicons name="log-out-outline" size={18} color={colors.foreground} />
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Modal>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  topBar: {
    height: 64,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
    letterSpacing: -0.5,
    paddingLeft: 7,
    marginTop: 7,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  agentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  agentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.foreground,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: colors.background,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  drawerHeader: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  drawerBrand: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.foreground,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  drawerSubtitle: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  navItems: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  navItemActive: {
    backgroundColor: colors.primary,
  },
  navLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.foreground,
  },
  navLabelActive: {
    color: colors.primaryForeground,
  },
  drawerBottom: {
    padding: spacing.md,
    gap: spacing.sm,
    marginTop: 'auto',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.xs,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  userPhone: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
})