export function createId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
