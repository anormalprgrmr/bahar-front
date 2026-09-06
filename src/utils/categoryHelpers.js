/**
 * @param {import('@/types/category').Category[]} categories
 */
export function getNavCategories(categories) {
  return categories.filter((category) => category.showInNav)
}

/**
 * @param {import('@/types/category').Category[]} categories
 */
export function getTopLevelCategories(categories) {
  return categories.filter((category) => !category.parentId)
}

/**
 * @param {import('@/types/category').Category[]} categories
 * @param {string} parentId
 */
export function getSubcategories(categories, parentId) {
  return categories.filter((category) => category.parentId === parentId)
}

/**
 * @param {import('@/types/category').Category[]} categories
 * @param {string} [parentId]
 */
export function getParentCategoryName(categories, parentId) {
  if (!parentId) return ''
  const parent = categories.find((category) => category.id === parentId)
  return parent?.name ?? ''
}
