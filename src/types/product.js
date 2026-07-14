/**
 * @typedef {'skincare' | 'makeup'} ProductCategory
 */

/**
 * @typedef {'discount' | 'hot' | 'bestseller'} ProductBadge
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {number} [originalPrice]
 * @property {string} image
 * @property {ProductCategory} category
 * @property {ProductBadge} [badge]
 * @property {boolean} isHot
 * @property {boolean} isBestseller
 * @property {number} salesCount
 */

export {}
