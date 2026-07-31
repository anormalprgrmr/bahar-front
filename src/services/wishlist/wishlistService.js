import { readStorage, writeStorage } from '@/utils/storage'
import { delay } from '@/utils/id'
import { getSalePrice } from '@/utils/productHelpers'
import { resolveMediaUrl } from '@/services/api/client'

const GUEST_WISHLIST_KEY = 'bahar_wishlist_guest'

/**
 * @param {string | null} userId
 */
function wishlistKey(userId) {
  return userId ? `bahar_wishlist_${userId}` : GUEST_WISHLIST_KEY
}

function emptyWishlist() {
  return { items: [], updatedAt: new Date().toISOString() }
}

/**
 * @param {string | null} userId
 * @returns {import('@/types/wishlist').Wishlist}
 */
export function getWishlistSync(userId) {
  return readStorage(wishlistKey(userId), emptyWishlist())
}

/**
 * @param {string | null} userId
 * @param {import('@/types/wishlist').Wishlist} wishlist
 */
function saveWishlist(userId, wishlist) {
  writeStorage(wishlistKey(userId), {
    ...wishlist,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * @param {string | null} userId
 */
export async function getWishlist(userId) {
  await delay(60)
  return getWishlistSync(userId)
}

/**
 * @param {string | null} userId
 * @param {import('@/types/product').Product} product
 */
export async function addToWishlist(userId, product) {
  await delay(80)
  const wishlist = getWishlistSync(userId)
  const exists = wishlist.items.some((item) => item.productId === product.id)

  if (!exists) {
    wishlist.items.unshift({
      productId: product.id,
      name: product.name,
      price: getSalePrice(product),
      image: resolveMediaUrl(product.image),
      addedAt: new Date().toISOString(),
    })
    saveWishlist(userId, wishlist)
  }

  return getWishlistSync(userId)
}

/**
 * @param {string | null} userId
 * @param {string} productId
 */
export async function removeFromWishlist(userId, productId) {
  await delay(60)
  const wishlist = getWishlistSync(userId)
  wishlist.items = wishlist.items.filter((item) => item.productId !== productId)
  saveWishlist(userId, wishlist)
  return getWishlistSync(userId)
}

/**
 * @param {string | null} userId
 * @param {string} productId
 */
export function isInWishlistSync(userId, productId) {
  return getWishlistSync(userId).items.some((item) => item.productId === productId)
}

/**
 * @param {string} userId
 */
export async function mergeGuestWishlist(userId) {
  await delay(60)
  const guestWishlist = getWishlistSync(null)
  const userWishlist = getWishlistSync(userId)

  if (guestWishlist.items.length === 0) {
    return userWishlist
  }

  for (const guestItem of guestWishlist.items) {
    const exists = userWishlist.items.some(
      (item) => item.productId === guestItem.productId,
    )
    if (!exists) {
      userWishlist.items.push(guestItem)
    }
  }

  saveWishlist(userId, userWishlist)
  saveWishlist(null, emptyWishlist())
  return getWishlistSync(userId)
}

/**
 * @param {import('@/types/wishlist').Wishlist} wishlist
 */
export function getWishlistCount(wishlist) {
  return wishlist.items.length
}
