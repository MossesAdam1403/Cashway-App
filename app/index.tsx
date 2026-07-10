import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    const checkOnboarding = async () => {
      await SecureStore.deleteItemAsync('onboarding_complete') // ← add this
      const seen = await SecureStore.getItemAsync('onboarding_complete')
      if (seen === 'true') {
        router.replace('/login')
      } else {
        router.replace('/onboarding')
      }
    }
    checkOnboarding()
  }, [])

  return null
}