const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

/**
 * @param {string} path
 * @param {RequestInit} [options]
 */
export async function apiClient(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json()
}

export function isApiEnabled() {
  return Boolean(API_BASE_URL)
}
