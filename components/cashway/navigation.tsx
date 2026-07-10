import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { useState, useRef, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import { colors, spacing, radius } from '../../constants/theme'

const DRAWER_WIDTH = 300

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const insets = useSafeAreaInsets()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const stored = await SecureStore.getItemAsync('userData')
      if (stored) setUser(JSON.parse(stored))
    } catch (err) {}
  }

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
    { label: 'Home', icon: 'home-outline', route: '/home' },
    { label: 'My Orders', icon: 'receipt-outline', route: '/my-orders' },
    { label: 'Profile', icon: 'person-outline', route: '/profile' },
    { label: 'Help & Support', icon: 'help-circle-outline', route: '/support' },
  ]

  const handleNavigate = (route: string) => {
    closeDrawer()
    setTimeout(() => router.push(route as any), 240)
  }

  const handleSignOut = async () => {
    closeDrawer()
    await SecureStore.deleteItemAsync('userToken')
    await SecureStore.deleteItemAsync('userRole')
    await SecureStore.deleteItemAsync('userData')
    setTimeout(() => router.replace('/login'), 240)
  }

  return (
    <>
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <Text style={styles.brandName}>CashWay</Text>
        <TouchableOpacity style={styles.menuButton} onPress={openDrawer}>
          <Ionicons name="menu" size={22} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {drawerOpen && (
        <Modal transparent animationType="none" visible={drawerOpen}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeDrawer} />
          <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>

            <View style={[styles.drawerHeader, { paddingTop: insets.top + 16 }]}>
              <Text style={styles.drawerBrand}>CashWay</Text>
              <Text style={styles.drawerSubtitle}>Customer Menu</Text>
            </View>

            <View style={styles.divider} />

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
                      <Ionicons name="arrow-forward" size={16} color={colors.primaryForeground} />
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>

            <View style={styles.divider} />

            <View style={styles.drawerBottom}>
              {user ? (
                <>
                  <View style={styles.userInfo}>
                    <View style={styles.userAvatar}>
                      <Ionicons name="person" size={18} color={colors.foreground} />
                    </View>
                    <View>
                      <Text style={styles.userName}>
                        {user.firstName} {user.lastName}
                      </Text>
                      <Text style={styles.userPhone}>{user.phone}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Ionicons name="log-out-outline" size={18} color={colors.foreground} />
                    <Text style={styles.signOutText}>Sign Out</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity style={styles.signInButton} onPress={() => handleNavigate('/login')}>
                    <Text style={styles.signInText}>Sign In</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.createAccountButton} onPress={() => handleNavigate('/register')}>
                    <Text style={styles.createAccountText}>Create Account</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

          </Animated.View>
        </Modal>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  topBar: { height: 64, backgroundColor: colors.background, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  brandName: { fontSize: 20, fontWeight: '700', color: colors.foreground, letterSpacing: -0.5, paddingLeft: 7, marginTop: 7 },
  menuButton: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  drawer: { position: 'absolute', top: 0, right: 0, bottom: 0, width: DRAWER_WIDTH, backgroundColor: colors.background, borderLeftWidth: 1, borderLeftColor: colors.border },
  drawerHeader: { padding: spacing.lg, paddingBottom: spacing.md },
  drawerBrand: { fontSize: 22, fontWeight: '700', color: colors.foreground, letterSpacing: -0.5, marginBottom: 2 },
  drawerSubtitle: { fontSize: 13, color: colors.mutedForeground },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.md },
  navItems: { padding: spacing.md, gap: spacing.xs },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: 14, borderRadius: radius.md },
  navItemActive: { backgroundColor: colors.primary },
  navLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: colors.foreground },
  navLabelActive: { color: colors.primaryForeground },
  drawerBottom: { padding: spacing.md, gap: spacing.sm, marginTop: 'auto' },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.xs, marginBottom: spacing.xs },
  userAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.muted, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  userName: { fontSize: 14, fontWeight: '600', color: colors.foreground },
  userPhone: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  signOutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: 44, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  signOutText: { fontSize: 14, fontWeight: '500', color: colors.foreground },
  signInButton: { height: 44, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  signInText: { fontSize: 14, fontWeight: '600', color: colors.primaryForeground },
  createAccountButton: { height: 44, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  createAccountText: { fontSize: 14, fontWeight: '500', color: colors.foreground },
})