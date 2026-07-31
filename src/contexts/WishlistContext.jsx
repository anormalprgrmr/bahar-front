import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  addToWishlist as addToWishlistService,
  getWishlist,
  getWishlistCount,
  isInWishlistSync,
  mergeGuestWishlist,
  removeFromWishlist as removeFromWishlistService,
} from '@/services/wishlist/wishlistService'

const WishlistContext = createContext(null)

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [wishlist, setWishlist] = useState(
    /** @type {import('@/types/wishlist').Wishlist} */ ({
      items: [],
      updatedAt: new Date().toISOString(),
    }),
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const next = await getWishlist(userId)
        if (!cancelled) setWishlist(next)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  useEffect(() => {
    if (!user?.id) return
    mergeGuestWishlist(user.id).then(setWishlist).catch(() => {})
  }, [user?.id])

  const refresh = useCallback(async () => {
    const next = await getWishlist(userId)
    setWishlist(next)
    return next
  }, [userId])

  const addItem = useCallback(
    async (product) => {
      const next = await addToWishlistService(userId, product)
      setWishlist(next)
      return next
    },
    [userId],
  )

  const removeItem = useCallback(
    async (productId) => {
      const next = await removeFromWishlistService(userId, productId)
      setWishlist(next)
      return next
    },
    [userId],
  )

  const toggleItem = useCallback(
    async (product) => {
      if (isInWishlistSync(userId, product.id)) {
        return removeItem(product.id)
      }
      return addItem(product)
    },
    [userId, addItem, removeItem],
  )

  const isSaved = useCallback(
    (productId) => isInWishlistSync(userId, productId),
    [userId, wishlist],
  )

  const value = useMemo(
    () => ({
      wishlist,
      loading,
      itemCount: getWishlistCount(wishlist),
      addItem,
      removeItem,
      toggleItem,
      isSaved,
      refresh,
    }),
    [wishlist, loading, addItem, removeItem, toggleItem, isSaved, refresh],
  )

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
