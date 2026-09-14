import { apiClient, toQueryString } from '@/services/api/client'
import { clearCart } from '@/services/cart/cartService'

/**
 * @param {import('@/types/order').CreateOrderPayload} payload
 * @param {{ auth?: boolean }} [options]
 * @returns {Promise<import('@/types/order').Order>}
 */
export async function createOrder(payload, options = {}) {
  const useAuth = Boolean(options.auth)
  return apiClient(useAuth ? '/orders' : '/orders/guest', {
    method: 'POST',
    auth: useAuth,
    body: JSON.stringify(payload),
  })
}

/**
 * Create order from local cart items, then clear cart.
 * @param {import('@/types/cart').CartItem[]} cartItems
 * @param {string | null} userId
 * @param {{
 *   name: string
 *   phone: string
 *   email?: string
 *   address: string
 *   authenticated?: boolean
 * }} contact
 * @returns {Promise<import('@/types/order').Order>}
 */
export async function createOrderFromCart(cartItems, userId, contact) {
  if (!cartItems.length) {
    throw new Error('سبد خرید شما خالی است.')
  }

  const order = await createOrder(
    {
      name: contact.name,
      phone: contact.phone,
      email: contact.email ?? '',
      address: contact.address,
      items: cartItems.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
    },
    { auth: Boolean(contact.authenticated) },
  )

  await clearCart(userId)
  return order
}

/**
 * @param {object} [params]
 * @returns {Promise<import('@/types/order').PaginatedOrders>}
 */
export async function getMyOrders(params = {}) {
  const query = toQueryString({
    page: params.page ?? 1,
    page_size: params.pageSize ?? 20,
  })
  return apiClient(`/orders/my${query}`, { auth: true })
}

/**
 * @param {string} orderId
 * @returns {Promise<import('@/types/order').Order | null>}
 */
export async function getOrderById(orderId) {
  try {
    return await apiClient(`/orders/${orderId}`, { auth: true })
  } catch {
    return null
  }
}

/**
 * @param {string} trackingCode
 * @returns {Promise<import('@/types/order').Order | null>}
 */
export async function trackOrder(trackingCode) {
  try {
    return await apiClient(`/orders/track/${encodeURIComponent(trackingCode)}`)
  } catch {
    return null
  }
}

/**
 * Mock payment confirmation (no payment gateway yet).
 * Order stays as created by backend (usually pending).
 * @param {import('@/types/order').Order} order
 */
export async function confirmMockPayment(order) {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return {
    ...order,
    _mockPaid: true,
  }
}
