import { apiClient, toQueryString } from '@/services/api/client'
import { clearCart } from '@/services/cart/cartService'

/**
 * @param {{ product_id: string, quantity: number }[]} items
 * @returns {Promise<import('@/types/order').Order>}
 */
export async function createOrder(items) {
  return apiClient('/orders', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ items }),
  })
}

/**
 * Create order from local cart items, then clear cart.
 * @param {import('@/types/cart').CartItem[]} cartItems
 * @param {string | null} userId
 * @returns {Promise<import('@/types/order').Order>}
 */
export async function createOrderFromCart(cartItems, userId) {
  if (!cartItems.length) {
    throw new Error('سبد خرید شما خالی است.')
  }

  const order = await createOrder(
    cartItems.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    })),
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
