import { clearAccessToken, getAccessToken } from '@/services/api/token'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
)

export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   */
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * @param {string} path
 * @param {RequestInit & { auth?: boolean, formData?: FormData }} [options]
 */
export async function apiClient(path, options = {}) {
  const { auth = false, formData, headers: customHeaders, ...rest } = options
  const headers = new Headers(customHeaders ?? {})

  if (!formData && !headers.has('Content-Type') && rest.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (auth) {
    const token = getAccessToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
    body: formData ?? rest.body,
  })

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('Content-Type') ?? ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await response.json() : null

  if (!response.ok) {
    if (response.status === 401 && auth) {
      clearAccessToken()
    }
    const message =
      payload?.message ||
      (response.status === 401
        ? 'احراز هویت ناموفق بود.'
        : response.status === 403
          ? 'دسترسی مجاز نیست.'
          : `خطای سرور (${response.status})`)
    throw new ApiError(message, response.status)
  }

  return payload
}

export function getApiBaseUrl() {
  return API_BASE_URL
}

/**
 * Resolve relative image URLs against the API origin.
 * @param {string | null | undefined} url
 */
export function resolveMediaUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url
  if (url.startsWith('/')) return `${API_BASE_URL}${url}`
  return url
}

/**
 * @param {Record<string, string | number | boolean | null | undefined>} params
 */
export function toQueryString(params) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    search.set(key, String(value))
  }
  const query = search.toString()
  return query ? `?${query}` : ''
}
