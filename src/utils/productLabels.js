/**
 * @param {import('@/types/product').ProductCategory} category
 */
export function getCategoryLabel(category) {
  const labels = {
    skincare: 'مراقبت پوست',
    makeup: 'آرایشی',
  }

  return labels[category] ?? category
}

/**
 * @param {import('@/types/product').ProductCategory} category
 */
export function getCategoryPath(category) {
  const paths = {
    skincare: '/skincare',
    makeup: '/makeup',
  }

  return paths[category] ?? '/'
}
