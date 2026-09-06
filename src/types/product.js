/**
 * @typedef {Object} ProductCategorySummary
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} [parentId]
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number | null} [newPrice]
 * @property {string} image
 * @property {number} stock
 * @property {string[]} images
 * @property {string[]} [categoryIds]
 * @property {ProductCategorySummary[]} [categories]
 * @property {string} [category]
 * @property {string} [country]
 * @property {string} [skinType]
 * @property {string} [famousProducts]
 * @property {string} [suitableFor]
 * @property {string} [keywords]
 * @property {boolean} onSale
 * @property {string} [created_at]
 */

/**
 * @typedef {Object} ProductUpsertPayload
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number | null} [newPrice]
 * @property {string} image
 * @property {number} [stock]
 * @property {string[]} images
 * @property {string[]} categoryIds
 * @property {string} [country]
 * @property {string} [skinType]
 * @property {string} [famousProducts]
 * @property {string} [suitableFor]
 * @property {string} [keywords]
 * @property {boolean} [onSale]
 */

/**
 * @typedef {Object} PaginationMeta
 * @property {number} page
 * @property {number} page_size
 * @property {number} total
 * @property {number} total_pages
 */

/**
 * @typedef {Object} PaginatedProducts
 * @property {Product[]} data
 * @property {PaginationMeta} pagination
 */

export {}
