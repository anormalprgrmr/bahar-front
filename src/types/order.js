/**
 * @typedef {'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'} OrderStatus
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} order_id
 * @property {string} product_id
 * @property {number} quantity
 * @property {number} unit_price
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} user_id
 * @property {OrderStatus} status
 * @property {number} total_amount
 * @property {string} created_at
 * @property {import('@/types/user').AdminUser} [user]
 * @property {OrderItem[]} [items]
 */

/**
 * @typedef {Object} PaginatedOrders
 * @property {Order[]} data
 * @property {import('@/types/product').PaginationMeta} pagination
 */

export {}
