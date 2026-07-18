/**
 * @typedef {Object} UserProfile
 * @property {string} fullName
 * @property {string} phone
 * @property {string} email
 * @property {string} [address]
 * @property {string} [city]
 * @property {string} [postalCode]
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} password
 * @property {UserProfile} profile
 * @property {string} createdAt
 */

/**
 * @typedef {Object} PublicUser
 * @property {string} id
 * @property {string} email
 * @property {UserProfile} profile
 * @property {string} createdAt
 */

export {}
