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
 * @property {string} [user_id]
 * @property {OrderStatus} status
 * @property {number} total_amount
 * @property {string} tracking_code
 * @property {string} [guest_name]
 * @property {string} [guest_phone]
 * @property {string} [guest_email]
 * @property {string} [guest_address]
 * @property {string} created_at
 * @property {import('@/types/user').AdminUser} [user]
 * @property {OrderItem[]} [items]
 */

/**
 * @typedef {Object} CreateOrderPayload
 * @property {string} name
 * @property {string} phone
 * @property {string} [email]
 * @property {string} address
 * @property {{ product_id: string, quantity: number }[]} items
 */

/**
 * @typedef {Object} PaginatedOrders
 * @property {Order[]} data
 * @property {import('@/types/product').PaginationMeta} pagination
 */

export {}
