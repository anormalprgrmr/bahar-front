import { readStorage, writeStorage } from '@/utils/storage'
import { createId, delay } from '@/utils/id'
import { clearCart, getCartSync, getCartTotals } from '@/services/cart/cartService'

const ORDERS_KEY = 'bahar_orders'

/**
 * @returns {import('@/types/order').Order[]}
 */
function getOrders() {
  return readStorage(ORDERS_KEY, [])
}

/**
 * @param {import('@/types/order').Order[]} orders
 */
function saveOrders(orders) {
  writeStorage(ORDERS_KEY, orders)
}

/**
 * @param {string} userId
 * @returns {Promise<import('@/types/order').Order[]>}
 */
export async function getUserOrders(userId) {
  await delay(200)
  return getOrders()
    .filter((order) => order.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

/**
 * @param {string} userId
 * @param {string} orderId
 * @returns {Promise<import('@/types/order').Order | null>}
 */
export async function getOrderById(userId, orderId) {
  await delay(150)
  return (
    getOrders().find(
      (order) => order.id === orderId && order.userId === userId,
    ) ?? null
  )
}

/**
 * Create an order from the current basket (pending payment).
 * @param {string} userId
 * @param {import('@/types/order').ShippingInfo} shipping
 * @returns {Promise<import('@/types/order').Order>}
 */
export async function createOrderFromCart(userId, shipping) {
  await delay(400)

  const cart = getCartSync(userId)
  if (cart.items.length === 0) {
    throw new Error('سبد خرید شما خالی است.')
  }

  if (!shipping.fullName?.trim() || !shipping.phone?.trim() || !shipping.address?.trim() || !shipping.city?.trim()) {
    throw new Error('لطفاً اطلاعات ارسال را کامل کنید.')
  }

  const { total } = getCartTotals(cart)

  /** @type {import('@/types/order').Order} */
  const order = {
    id: createId('order'),
    userId,
    items: cart.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    })),
    total,
    status: 'pending',
    shipping: {
      fullName: shipping.fullName.trim(),
      phone: shipping.phone.trim(),
      address: shipping.address.trim(),
      city: shipping.city.trim(),
      postalCode: shipping.postalCode?.trim() ?? '',
    },
    createdAt: new Date().toISOString(),
  }

  saveOrders([order, ...getOrders()])
  return order
}

/**
 * Mock payment gateway — always succeeds after a short delay.
 * @param {string} userId
 * @param {string} orderId
 * @returns {Promise<import('@/types/order').Order>}
 */
export async function payOrderMock(userId, orderId) {
  await delay(1200)

  const orders = getOrders()
  const index = orders.findIndex(
    (order) => order.id === orderId && order.userId === userId,
  )

  if (index === -1) {
    throw new Error('سفارش یافت نشد.')
  }

  const order = orders[index]

  if (order.status === 'paid') {
    return order
  }

  const paid = {
    ...order,
    status: /** @type {const} */ ('paid'),
    paidAt: new Date().toISOString(),
    paymentRef: `MOCK-${Date.now().toString(36).toUpperCase()}`,
  }

  orders[index] = paid
  saveOrders(orders)
  await clearCart(userId)
  return paid
}
