/**
 * @param {string} key
 * @param {unknown} fallback
 */
export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

/**
 * @param {string} key
 * @param {unknown} value
 */
export function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

/**
 * @param {string} key
 */
export function removeStorage(key) {
  localStorage.removeItem(key)
}
