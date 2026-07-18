import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from '@/services/auth/authService'
import { mergeGuestCart } from '@/services/cart/cartService'

const AuthContext = createContext(null)

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(/** @type {import('@/types/user').PublicUser | null} */ (null))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        const current = await getCurrentUser()
        if (!cancelled) setUser(current)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (payload) => {
    const nextUser = await loginUser(payload)
    await mergeGuestCart(nextUser.id)
    setUser(nextUser)
    return nextUser
  }, [])

  const register = useCallback(async (payload) => {
    const nextUser = await registerUser(payload)
    await mergeGuestCart(nextUser.id)
    setUser(nextUser)
    return nextUser
  }, [])

  const logout = useCallback(async () => {
    await logoutUser()
    setUser(null)
  }, [])

  const updateProfile = useCallback(
    async (profile) => {
      if (!user) throw new Error('ابتدا وارد حساب کاربری شوید.')
      const nextUser = await updateUserProfile(user.id, profile)
      setUser(nextUser)
      return nextUser
    },
    [user],
  )

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, loading, login, register, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
