import * as SecureStore from 'expo-secure-store'
import { router } from 'expo-router'

export const BASE_URL = 'https://cashway-app.onrender.com'

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = await SecureStore.getItemAsync('userToken')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  // Token expired or invalid
  if (response.status === 401) {
    await SecureStore.deleteItemAsync('userToken')
    await SecureStore.deleteItemAsync('userRole')
    await SecureStore.deleteItemAsync('userData')
    router.replace('/login')
    throw new Error('Session expired. Please sign in again.')
  }

  const data = await response.json()
  return { data, ok: response.ok, status: response.status }
}