/**
 * @typedef {'pending' | 'paid' | 'failed'} OrderStatus
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} productId
 * @property {string} name
 * @property {number} price
 * @property {string} image
 * @property {number} quantity
 */

/**
 * @typedef {Object} ShippingInfo
 * @property {string} fullName
 * @property {string} phone
 * @property {string} address
 * @property {string} city
 * @property {string} [postalCode]
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} userId
 * @property {OrderItem[]} items
 * @property {number} total
 * @property {OrderStatus} status
 * @property {ShippingInfo} shipping
 * @property {string} createdAt
 * @property {string} [paidAt]
 * @property {string} [paymentRef]
 */

export {}
