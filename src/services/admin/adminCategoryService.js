import { apiClient } from '@/services/api/client'

/** @returns {Promise<import('@/types/category').Category[]>} */
export async function adminListCategories() {
  const result = await apiClient('/categories')
  return Array.isArray(result) ? result : []
}

/**
 * @param {import('@/types/category').CategoryUpsertPayload} payload
 * @returns {Promise<import('@/types/category').Category>}
 */
export async function adminCreateCategory(payload) {
  return apiClient('/categories', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({
      name: payload.name.trim(),
      slug: payload.slug?.trim() || undefined,
      parentId: payload.parentId?.trim() || undefined,
      showInNav: Boolean(payload.showInNav),
    }),
  })
}

/**
 * @param {string} id
 * @param {import('@/types/category').CategoryUpsertPayload} payload
 * @returns {Promise<import('@/types/category').Category>}
 */
export async function adminUpdateCategory(id, payload) {
  return apiClient(`/categories/${id}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify({
      name: payload.name.trim(),
      slug: payload.slug?.trim() || undefined,
      parentId: payload.parentId?.trim() || undefined,
      showInNav: Boolean(payload.showInNav),
    }),
  })
}

/**
 * @param {string} id
 */
/**
 * @param {string | null} parentId
 * @param {string[]} orderedIds
 */
export async function adminReorderCategories(parentId, orderedIds) {
  return apiClient('/categories/reorder', {
    method: 'PUT',
    auth: true,
    body: JSON.stringify({
      parentId: parentId ?? null,
      orderedIds,
    }),
  })
}

/**
 * @param {string} id
 */
export async function adminDeleteCategory(id) {
  return apiClient(`/categories/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

/**
 * @param {string} id
 * @returns {Promise<import('@/types/category').Category | null>}
 */
export async function adminGetCategoryById(id) {
  try {
    return await apiClient(`/categories/${id}`)
  } catch {
    return null
  }
}
