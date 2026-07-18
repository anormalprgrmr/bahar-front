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
 * @param {string} category
 */
export function getCategoryLabel(category) {
  const labels = {
    skincare: 'مراقبت پوست',
    makeup: 'آرایشی',
  }
  return labels[category] ?? category
}

/**
 * @param {string} category
 */
export function getCategoryPath(category) {
  const paths = {
    skincare: '/skincare',
    makeup: '/makeup',
  }
  return paths[category] ?? '/'
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
