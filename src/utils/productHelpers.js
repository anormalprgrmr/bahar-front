/**
 * @param {import('@/types/product').Product} product
 */
export function getSalePrice(product) {
  return product.newPrice != null ? product.newPrice : product.price
}

/**
 * @param {import('@/types/product').Product} product
 */
export function getOriginalPrice(product) {
  return product.newPrice != null ? product.price : null
}

/**
 * @param {import('@/types/product').Product} product
 */
export function isInStock(product) {
  return (product.stock ?? 0) > 0
}

/**
 * @param {import('@/types/product').Product} product
 */
export function getProductBadge(product) {
  if (product.onSale || product.newPrice != null) return 'تخفیف'
  return null
}

/**
 * @param {string} [slug]
 * @param {import('@/types/category').Category[]} [categories]
 */
export function getCategoryLabel(slug, categories = []) {
  if (!slug) return '—'
  const match = categories.find((category) => category.slug === slug)
  return match?.name ?? slug
}

/**
 * @param {string} [slug]
 */
export function getCategoryPath(slug) {
  if (!slug) return '/'
  return `/categories/${slug}`
}

/**
 * @param {import('@/types/order').OrderStatus} status
 */
export function getOrderStatusLabel(status) {
  const labels = {
    pending: 'در انتظار پرداخت',
    paid: 'پرداخت‌شده',
    processing: 'در حال آماده‌سازی',
    shipped: 'ارسال‌شده',
    delivered: 'تحویل‌شده',
    cancelled: 'لغو شده',
  }
  return labels[status] ?? status
}
