import { apiClient } from '@/services/api/client'

/** @returns {Promise<import('@/types/category').Category[]>} */
export async function listCategories() {
  const result = await apiClient('/categories')
  return Array.isArray(result) ? result : []
}

/**
 * @param {string} id
 * @returns {Promise<import('@/types/category').Category | null>}
 */
export async function getCategoryById(id) {
  try {
    return await apiClient(`/categories/${id}`)
  } catch {
    return null
  }
}

/**
 * @param {import('@/types/category').Category[]} categories
 * @param {string} [slug]
 */
export function findCategoryBySlug(categories, slug) {
  if (!slug) return null
  return categories.find((category) => category.slug === slug) ?? null
}

/**
 * @param {import('@/types/category').Category[]} categories
 * @param {string} [id]
 */
export function findCategoryById(categories, id) {
  if (!id) return null
  return categories.find((category) => category.id === id) ?? null
}
