import { apiClient, resolveMediaUrl, toQueryString } from '@/services/api/client'

/**
 * @param {import('@/types/product').Product} product
 * @returns {import('@/types/product').Product}
 */
export function normalizeProduct(product) {
  return {
    ...product,
    image: resolveMediaUrl(product.image),
    images: (product.images ?? []).map(resolveMediaUrl),
    stock: product.stock ?? 0,
    onSale: Boolean(product.onSale),
  }
}

/**
 * @param {object} [params]
 * @returns {Promise<import('@/types/product').PaginatedProducts>}
 */
export async function listProducts(params = {}) {
  const query = toQueryString({
    page: params.page ?? 1,
    page_size: params.pageSize ?? 12,
    q: params.q,
    category: params.category,
    on_sale: params.onSale,
    in_stock: params.inStock,
    min_price: params.minPrice,
    max_price: params.maxPrice,
    sort_by: params.sortBy,
    sort_order: params.sortOrder,
  })

  const result = await apiClient(`/products${query}`)
  return {
    data: (result?.data ?? []).map(normalizeProduct),
    pagination: result?.pagination ?? {
      page: 1,
      page_size: 12,
      total: 0,
      total_pages: 0,
    },
  }
}

/** @returns {Promise<import('@/types/product').Product[]>} */
export async function getAllProducts() {
  const result = await listProducts({ page: 1, pageSize: 100 })
  return result.data
}

/** @returns {Promise<import('@/types/product').Product[]>} */
export async function getHotProducts() {
  try {
    const result = await listProducts({
      page: 1,
      pageSize: 4,
      onSale: true,
      sortBy: 'created_at',
      sortOrder: 'desc',
    })
    return result.data
  } catch {
    return []
  }
}

/** @returns {Promise<import('@/types/product').Product[]>} */
export async function getBestsellerProducts() {
  try {
    const result = await listProducts({
      page: 1,
      pageSize: 4,
      inStock: true,
      sortBy: 'created_at',
      sortOrder: 'desc',
    })
    return result.data
  } catch {
    return []
  }
}

/** @returns {Promise<import('@/types/product').Product[]>} */
export async function getWeeklyDeals() {
  try {
    const result = await listProducts({
      page: 1,
      pageSize: 4,
      onSale: true,
    })
    return result.data
  } catch {
    return []
  }
}

/** @returns {Promise<import('@/types/product').Product[]>} */
export async function getFeaturedProducts() {
  try {
    const result = await listProducts({
      page: 1,
      pageSize: 4,
      sortBy: 'created_at',
      sortOrder: 'desc',
    })
    return result.data
  } catch {
    return []
  }
}

/**
 * @param {string} id
 * @returns {Promise<import('@/types/product').Product | null>}
 */
export async function getProductById(id) {
  try {
    const product = await apiClient(`/products/${id}`)
    return normalizeProduct(product)
  } catch {
    return null
  }
}

/**
 * @param {string} productId
 * @param {string} category
 * @param {number} [limit=4]
 */
export async function getRelatedProducts(productId, category, limit = 4) {
  const result = await listProducts({
    page: 1,
    pageSize: limit + 4,
    category,
  })
  return result.data.filter((product) => product.id !== productId).slice(0, limit)
}

/**
 * @param {string} category
 */
export async function getProductsByCategory(category) {
  const result = await listProducts({
    page: 1,
    pageSize: 24,
    category,
  })
  return result.data
}
