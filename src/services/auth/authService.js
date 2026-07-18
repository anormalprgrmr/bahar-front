import { readStorage, writeStorage, removeStorage } from '@/utils/storage'
import { createId, delay } from '@/utils/id'

const USERS_KEY = 'bahar_users'
const SESSION_KEY = 'bahar_session'

/**
 * @returns {import('@/types/user').User[]}
 */
function getUsers() {
  return readStorage(USERS_KEY, [])
}

/**
 * @param {import('@/types/user').User[]} users
 */
function saveUsers(users) {
  writeStorage(USERS_KEY, users)
}

/**
 * @param {import('@/types/user').User} user
 * @returns {import('@/types/user').PublicUser}
 */
function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    profile: user.profile,
    createdAt: user.createdAt,
  }
}

/**
 * @returns {Promise<import('@/types/user').PublicUser | null>}
 */
export async function getCurrentUser() {
  await delay(150)
  const session = readStorage(SESSION_KEY, null)
  if (!session?.userId) return null

  const user = getUsers().find((item) => item.id === session.userId)
  return user ? toPublicUser(user) : null
}

/**
 * @param {{ email: string, password: string, fullName: string, phone?: string }} payload
 * @returns {Promise<import('@/types/user').PublicUser>}
 */
export async function registerUser(payload) {
  await delay()

  const email = payload.email.trim().toLowerCase()
  const password = payload.password
  const fullName = payload.fullName.trim()
  const phone = payload.phone?.trim() ?? ''

  if (!email || !password || !fullName) {
    throw new Error('لطفاً همه فیلدهای ضروری را پر کنید.')
  }

  if (password.length < 6) {
    throw new Error('رمز عبور باید حداقل ۶ کاراکتر باشد.')
  }

  const users = getUsers()
  if (users.some((user) => user.email === email)) {
    throw new Error('این ایمیل قبلاً ثبت شده است.')
  }

  const user = {
    id: createId('user'),
    email,
    password,
    createdAt: new Date().toISOString(),
    profile: {
      fullName,
      phone,
      email,
      address: '',
      city: '',
      postalCode: '',
    },
  }

  saveUsers([...users, user])
  writeStorage(SESSION_KEY, { userId: user.id })
  return toPublicUser(user)
}

/**
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<import('@/types/user').PublicUser>}
 */
export async function loginUser(payload) {
  await delay()

  const email = payload.email.trim().toLowerCase()
  const password = payload.password

  if (!email || !password) {
    throw new Error('ایمیل و رمز عبور را وارد کنید.')
  }

  const user = getUsers().find(
    (item) => item.email === email && item.password === password,
  )

  if (!user) {
    throw new Error('ایمیل یا رمز عبور نادرست است.')
  }

  writeStorage(SESSION_KEY, { userId: user.id })
  return toPublicUser(user)
}

/**
 * @returns {Promise<void>}
 */
export async function logoutUser() {
  await delay(100)
  removeStorage(SESSION_KEY)
}

/**
 * @param {string} userId
 * @param {Partial<import('@/types/user').UserProfile>} profile
 * @returns {Promise<import('@/types/user').PublicUser>}
 */
export async function updateUserProfile(userId, profile) {
  await delay()

  const users = getUsers()
  const index = users.findIndex((user) => user.id === userId)

  if (index === -1) {
    throw new Error('کاربر یافت نشد.')
  }

  const current = users[index]
  const nextProfile = {
    ...current.profile,
    ...profile,
    email: current.email,
    fullName: (profile.fullName ?? current.profile.fullName).trim(),
    phone: (profile.phone ?? current.profile.phone).trim(),
    address: (profile.address ?? current.profile.address ?? '').trim(),
    city: (profile.city ?? current.profile.city ?? '').trim(),
    postalCode: (profile.postalCode ?? current.profile.postalCode ?? '').trim(),
  }

  if (!nextProfile.fullName) {
    throw new Error('نام و نام خانوادگی الزامی است.')
  }

  const updated = { ...current, profile: nextProfile }
  users[index] = updated
  saveUsers(users)
  return toPublicUser(updated)
}
