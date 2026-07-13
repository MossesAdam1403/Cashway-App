import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { isAuthenticated, getRole } from '../utils/auth'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    const initialize = async () => {
      try {
        // Check onboarding
        const onboardingSeen = await SecureStore.getItemAsync('onboarding_complete')
        if (!onboardingSeen) {
          router.replace('/onboarding')
          return
        }

        // Check authentication
        const authenticated = await isAuthenticated()
        if (!authenticated) {
          router.replace('/login')
          return
        }

        // Route based on role
        const role = await getRole()
        if (role === 'agent') {
          router.replace('/agent/home')
        } else {
          router.replace('/home')
        }

      } catch (err) {
        router.replace('/login')
      }
    }

    initialize()
  }, [])

  return null
}