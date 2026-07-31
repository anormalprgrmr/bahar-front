export const INSTAGRAM_URL = 'https://www.instagram.com/bahar_arayeshi'
export const INSTAGRAM_HANDLE = '@bahar_arayeshi'

/**
 * @param {string} [productName]
 */
export function getProductAskUrl(productName) {
  if (!productName?.trim()) return INSTAGRAM_URL
  return INSTAGRAM_URL
}
