import { apiClient } from '@/services/api/client'
import { clearAccessToken, getAccessToken, setAccessToken } from '@/services/api/token'

/**
 * @param {{ email: string, password: string }} payload
 */
export async function registerUser(payload) {
  await apiClient('/register', {
    method: 'POST',
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    }),
  })

  return loginUser(payload)
}

/**
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<import('@/types/user').User>}
 */
export async function loginUser(payload) {
  const result = await apiClient('/login', {
    method: 'POST',
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    }),
  })

  if (!result?.access_token) {
    throw new Error('توکن دریافت نشد.')
  }

  setAccessToken(result.access_token)
  return getCurrentUser()
}

/**
 * @returns {Promise<import('@/types/user').User | null>}
 */
export async function getCurrentUser() {
  if (!getAccessToken()) return null

  try {
    return await apiClient('/me', { auth: true })
  } catch {
    clearAccessToken()
    return null
  }
}

export async function logoutUser() {
  clearAccessToken()
}
