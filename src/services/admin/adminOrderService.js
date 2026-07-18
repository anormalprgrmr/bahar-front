import { apiClient, toQueryString } from '@/services/api/client'

/**
 * @param {object} [params]
 * @returns {Promise<import('@/types/order').PaginatedOrders>}
 */
export async function adminListOrders(params = {}) {
  const query = toQueryString({
    page: params.page ?? 1,
    page_size: params.pageSize ?? 20,
  })
  return apiClient(`/admin/orders${query}`, { auth: true })
}

/**
 * @param {string} orderId
 * @param {import('@/types/order').OrderStatus} status
 */
export async function adminUpdateOrderStatus(orderId, status) {
  return apiClient(`/admin/orders/${orderId}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify({ status }),
  })
}

/**
 * @param {string} orderId
 */
export async function adminDeleteOrder(orderId) {
  return apiClient(`/admin/orders/${orderId}`, {
    method: 'DELETE',
    auth: true,
  })
}
