import { readStorage, writeStorage } from '@/utils/storage'
import { delay } from '@/utils/id'
import {
  getSalePrice,
  getOriginalPrice,
  isInStock,
} from '@/utils/productHelpers'
import { resolveMediaUrl } from '@/services/api/client'

const GUEST_CART_KEY = 'bahar_cart_guest'

/**
 * @param {string | null} userId
 */
function cartKey(userId) {
  return userId ? `bahar_cart_${userId}` : GUEST_CART_KEY
}

function emptyCart() {
  return { items: [], updatedAt: new Date().toISOString() }
}

/**
 * @param {string | null} userId
 * @returns {import('@/types/cart').Cart}
 */
export function getCartSync(userId) {
  return readStorage(cartKey(userId), emptyCart())
}

/**
 * @param {string | null} userId
 * @param {import('@/types/cart').Cart} cart
 */
function saveCart(userId, cart) {
  writeStorage(cartKey(userId), {
    ...cart,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * @param {string | null} userId
 */
export async function getCart(userId) {
  await delay(80)
  return getCartSync(userId)
}

/**
 * @param {string | null} userId
 * @param {import('@/types/product').Product} product
 * @param {number} [quantity=1]
 */
export async function addToCart(userId, product, quantity = 1) {
  await delay(100)

  if (!isInStock(product)) {
    throw new Error('این محصول موجود نیست.')
  }

  const cart = getCartSync(userId)
  const existing = cart.items.find((item) => item.productId === product.id)
  const salePrice = getSalePrice(product)
  const original = getOriginalPrice(product)

  if (existing) {
    existing.quantity += quantity
  } else {
    cart.items.push({
      productId: product.id,
      name: product.name,
      price: salePrice,
      originalPrice: original ?? undefined,
      image: resolveMediaUrl(product.image),
      quantity,
    })
  }

  saveCart(userId, cart)
  return getCartSync(userId)
}

/**
 * @param {string | null} userId
 * @param {string} productId
 * @param {number} quantity
 */
export async function updateCartItemQuantity(userId, productId, quantity) {
  await delay(80)
  const cart = getCartSync(userId)

  if (quantity <= 0) {
    cart.items = cart.items.filter((item) => item.productId !== productId)
  } else {
    const item = cart.items.find((entry) => entry.productId === productId)
    if (item) item.quantity = quantity
  }

  saveCart(userId, cart)
  return getCartSync(userId)
}

/**
 * @param {string | null} userId
 * @param {string} productId
 */
export async function removeFromCart(userId, productId) {
  return updateCartItemQuantity(userId, productId, 0)
}

/**
 * @param {string | null} userId
 */
export async function clearCart(userId) {
  await delay(80)
  const cart = emptyCart()
  saveCart(userId, cart)
  return cart
}

/**
 * @param {string} userId
 */
export async function mergeGuestCart(userId) {
  await delay(80)

  const guestCart = getCartSync(null)
  const userCart = getCartSync(userId)

  if (guestCart.items.length === 0) {
    return userCart
  }

  for (const guestItem of guestCart.items) {
    const existing = userCart.items.find(
      (item) => item.productId === guestItem.productId,
    )
    if (existing) {
      existing.quantity += guestItem.quantity
    } else {
      userCart.items.push(guestItem)
    }
  }

  saveCart(userId, userCart)
  saveCart(null, emptyCart())
  return getCartSync(userId)
}

/**
 * @param {import('@/types/cart').Cart} cart
 */
export function getCartTotals(cart) {
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  return { itemCount, total }
}
