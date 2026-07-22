/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} [name]
 * @property {string} [phone]
 * @property {string} [address]
 * @property {boolean} is_admin
 * @property {string} [created_at]
 */

/**
 * @typedef {Object} AdminUser
 * @property {string} id
 * @property {string} email
 * @property {string} [name]
 * @property {string} [phone]
 * @property {string} [address]
 * @property {boolean} is_admin
 * @property {string} [created_at]
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} email
 * @property {string} password
 * @property {string} [name]
 * @property {string} [phone]
 * @property {string} [address]
 */

/**
 * @typedef {Object} ProfileUpdateRequest
 * @property {string} [email]
 * @property {string} [name]
 * @property {string} [phone]
 * @property {string} [address]
 * @property {string} [password]
 */

/**
 * @typedef {Object} AdminUserUpdateRequest
 * @property {string} [email]
 * @property {string} [name]
 * @property {string} [phone]
 * @property {string} [address]
 * @property {boolean} [is_admin]
 * @property {string} [password]
 */

/**
 * @typedef {Object} PaginatedAdminUsers
 * @property {AdminUser[]} data
 * @property {import('@/types/product').PaginationMeta} pagination
 */

export {}
