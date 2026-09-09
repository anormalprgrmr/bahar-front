import { readStorage, writeStorage } from '@/utils/storage'

const TREND_PRODUCT_IDS_KEY = 'bahar_trend_product_ids'

/**
 * Returns `null` until trend selection has been configured by an admin.
 *
 * @returns {string[] | null}
 */
export function getTrendProductIds() {
  const storedIds = readStorage(TREND_PRODUCT_IDS_KEY, null)
  if (!Array.isArray(storedIds)) return null

  return [...new Set(storedIds.filter((id) => typeof id === 'string' && id))]
}

/**
 * @param {string} productId
 */
export function isTrendProduct(productId) {
  return getTrendProductIds()?.includes(productId) ?? false
}

/**
 * @param {string} productId
 * @param {boolean} selected
 */
export function setTrendProduct(productId, selected) {
  const storedIds = getTrendProductIds()
  if (!selected && storedIds === null) return

  const currentIds = storedIds ?? []
  const nextIds = selected
    ? [...new Set([...currentIds, productId])]
    : currentIds.filter((id) => id !== productId)

  writeStorage(TREND_PRODUCT_IDS_KEY, nextIds)
}
