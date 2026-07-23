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
 * @property {string} [categoryId]
 * @property {string} [category]
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
 * @property {string} [categoryId]
 * @property {string} [category]
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
