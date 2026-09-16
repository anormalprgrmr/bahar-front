/**
 * @param {import('@/types/category').Category[]} categories
 */
function compareCategoriesByOrder(left, right) {
  const leftOrder = left.sortOrder ?? 0
  const rightOrder = right.sortOrder ?? 0
  if (leftOrder !== rightOrder) return leftOrder - rightOrder
  return left.name.localeCompare(right.name, 'fa')
}

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
  return categories
    .filter((category) => !category.parentId)
    .sort(compareCategoriesByOrder)
}

/**
 * @param {import('@/types/category').Category[]} categories
 * @param {string} parentId
 */
export function getSubcategories(categories, parentId) {
  return categories
    .filter((category) => category.parentId === parentId)
    .sort(compareCategoriesByOrder)
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

/**
 * @param {import('@/types/category').Category[]} categories
 */
export function buildAdminCategoryRows(categories) {
  /** @type {{ category: import('@/types/category').Category, parentId: string | null, level: number }[]} */
  const rows = []

  for (const parent of getTopLevelCategories(categories)) {
    rows.push({ category: parent, parentId: null, level: 0 })
    for (const child of getSubcategories(categories, parent.id)) {
      rows.push({ category: child, parentId: parent.id, level: 1 })
    }
  }

  return rows
}
