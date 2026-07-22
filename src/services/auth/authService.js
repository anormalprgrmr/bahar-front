import { apiClient } from '@/services/api/client'
import { clearAccessToken, getAccessToken, setAccessToken } from '@/services/api/token'

/**
 * @param {import('@/types/user').RegisterRequest} payload
 */
export async function registerUser(payload) {
  /** @type {Record<string, string>} */
  const body = {
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  }

  if (payload.name?.trim()) body.name = payload.name.trim()
  if (payload.phone?.trim()) body.phone = payload.phone.trim()
  if (payload.address?.trim()) body.address = payload.address.trim()

  await apiClient('/register', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  return loginUser({ email: payload.email, password: payload.password })
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

/**
 * @param {import('@/types/user').ProfileUpdateRequest} payload
 * @returns {Promise<import('@/types/user').User>}
 */
export async function updateMyProfile(payload) {
  /** @type {Record<string, string>} */
  const body = {}

  if (payload.email?.trim()) body.email = payload.email.trim().toLowerCase()
  if (payload.name?.trim()) body.name = payload.name.trim()
  if (payload.phone?.trim()) body.phone = payload.phone.trim()
  if (payload.address?.trim()) body.address = payload.address.trim()
  if (payload.password?.trim()) body.password = payload.password

  if (Object.keys(body).length === 0) {
    throw new Error('حداقل یک فیلد برای به‌روزرسانی لازم است.')
  }

  return apiClient('/me', {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(body),
  })
}

export async function logoutUser() {
  clearAccessToken()
}
