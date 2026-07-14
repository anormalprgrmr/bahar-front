import { apiClient, isApiEnabled } from '@/services/api/client'
import { mockProducts } from '@/mocks/products'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

/** @returns {Promise<import('@/types/product').Product[]>} */
async function fetchFromMock() {
  await delay()
  return mockProducts
}

/** @returns {Promise<import('@/types/product').Product[]>} */
export async function getAllProducts() {
  if (isApiEnabled()) {
    return apiClient('/products')
  }

  return fetchFromMock()
}

/** @returns {Promise<import('@/types/product').Product[]>} */
export async function getHotProducts() {
  if (isApiEnabled()) {
    return apiClient('/products/hot')
  }

  const products = await fetchFromMock()
  return products.filter((product) => product.isHot).slice(0, 4)
}

/** @returns {Promise<import('@/types/product').Product[]>} */
export async function getBestsellerProducts() {
  if (isApiEnabled()) {
    return apiClient('/products/bestsellers')
  }

  const products = await fetchFromMock()
  return [...products]
    .filter((product) => product.isBestseller)
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 4)
}

/** @returns {Promise<import('@/types/product').Product[]>} */
export async function getWeeklyDeals() {
  if (isApiEnabled()) {
    return apiClient('/products/weekly-deals')
  }

  const products = await fetchFromMock()
  return products.filter((product) => product.badge === 'discount').slice(0, 4)
}

/** @returns {Promise<import('@/types/product').Product[]>} */
export async function getFeaturedProducts() {
  if (isApiEnabled()) {
    return apiClient('/products/featured')
  }

  const products = await fetchFromMock()
  return products.slice(0, 4)
}
