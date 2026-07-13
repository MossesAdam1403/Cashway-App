import * as SecureStore from 'expo-secure-store'

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('userToken')
}

export const getUser = async (): Promise<any | null> => {
  const data = await SecureStore.getItemAsync('userData')
  return data ? JSON.parse(data) : null
}

export const getRole = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('userRole')
}

export const saveAuthData = async (token: string, role: string, user: object) => {
  await SecureStore.setItemAsync('userToken', token)
  await SecureStore.setItemAsync('userRole', role)
  await SecureStore.setItemAsync('userData', JSON.stringify(user))
}

export const clearAuthData = async () => {
  await SecureStore.deleteItemAsync('userToken')
  await SecureStore.deleteItemAsync('userRole')
  await SecureStore.deleteItemAsync('userData')
  await SecureStore.deleteItemAsync('cashway_active_request')
}

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await SecureStore.getItemAsync('userToken')
  return !!token
}