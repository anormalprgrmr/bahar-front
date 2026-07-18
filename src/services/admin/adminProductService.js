import { apiClient, toQueryString } from '@/services/api/client'
import { normalizeProduct } from '@/services/products/productService'

/**
 * @param {object} [params]
 * @returns {Promise<import('@/types/product').PaginatedProducts>}
 */
export async function adminListProducts(params = {}) {
  const query = toQueryString({
    page: params.page ?? 1,
    page_size: params.pageSize ?? 20,
    q: params.q,
    category: params.category,
  })
  const result = await apiClient(`/products${query}`, { auth: true })
  return {
    data: (result?.data ?? []).map(normalizeProduct),
    pagination: result?.pagination,
  }
}

/**
 * @param {import('@/types/product').ProductUpsertPayload} payload
 * @returns {Promise<import('@/types/product').Product>}
 */
export async function adminCreateProduct(payload) {
  const product = await apiClient('/products', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  })
  return normalizeProduct(product)
}

/**
 * @param {string} id
 * @param {import('@/types/product').ProductUpsertPayload} payload
 */
export async function adminUpdateProduct(id, payload) {
  return apiClient(`/products/${id}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  })
}

/**
 * @param {string} id
 */
export async function adminDeleteProduct(id) {
  return apiClient(`/products/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

/**
 * @param {string} productId
 * @param {File} file
 * @param {boolean} [setAsMain=false]
 */
export async function adminUploadProductImage(productId, file, setAsMain = false) {
  const formData = new FormData()
  formData.append('image', file)

  const query = setAsMain ? '?set_as_main=true' : ''
  const result = await apiClient(`/products/${productId}/images${query}`, {
    method: 'POST',
    auth: true,
    formData,
  })

  return {
    imageUrl: result?.image_url,
    product: result?.product ? normalizeProduct(result.product) : null,
  }
}
