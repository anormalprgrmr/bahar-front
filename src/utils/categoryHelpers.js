/**
 * @param {import('@/types/category').Category[]} categories
 */
export function getNavCategories(categories) {
  return categories.filter((category) => category.showInNav)
}
