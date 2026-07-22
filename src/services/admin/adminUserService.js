import { apiClient, toQueryString } from '@/services/api/client'

/**
 * @param {object} [params]
 * @returns {Promise<import('@/types/user').PaginatedAdminUsers>}
 */
export async function adminListUsers(params = {}) {
  const query = toQueryString({
    page: params.page ?? 1,
    page_size: params.pageSize ?? 20,
  })
  return apiClient(`/admin/users${query}`, { auth: true })
}

/**
 * @param {string} userId
 * @param {import('@/types/user').AdminUserUpdateRequest} payload
 */
export async function adminUpdateUser(userId, payload) {
  /** @type {Record<string, string | boolean>} */
  const body = {}

  if (payload.email?.trim()) body.email = payload.email.trim().toLowerCase()
  if (payload.name?.trim()) body.name = payload.name.trim()
  if (payload.phone?.trim()) body.phone = payload.phone.trim()
  if (payload.address?.trim()) body.address = payload.address.trim()
  if (typeof payload.is_admin === 'boolean') body.is_admin = payload.is_admin
  if (payload.password?.trim()) body.password = payload.password

  return apiClient(`/admin/users/${userId}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(body),
  })
}

/**
 * @param {string} userId
 */
export async function adminDeleteUser(userId) {
  return apiClient(`/admin/users/${userId}`, {
    method: 'DELETE',
    auth: true,
  })
}
