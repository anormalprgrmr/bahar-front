export const INSTAGRAM_URL = 'https://www.instagram.com/bahar_arayeshi__'
export const INSTAGRAM_HANDLE = '@bahar_arayeshi__'

export const CONTACT_PHONE = '09052102006'
export const CONTACT_PHONE_DISPLAY = '۰۹۰۵۲۱۰۲۰۰۶'
export const WHATSAPP_URL = `https://wa.me/98${CONTACT_PHONE.slice(1)}`
export const TELEGRAM_URL = `https://t.me/+98${CONTACT_PHONE.slice(1)}`

/**
 * @param {string} [productName]
 */
export function getProductAskUrl(productName) {
  if (!productName?.trim()) return INSTAGRAM_URL
  return INSTAGRAM_URL
}
