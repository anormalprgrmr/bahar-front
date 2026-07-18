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
  addToCart as addToCartService,
  clearCart as clearCartService,
  getCart,
  getCartTotals,
  removeFromCart as removeFromCartService,
  updateCartItemQuantity as updateQuantityService,
} from '@/services/cart/cartService'

const CartContext = createContext(null)

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function CartProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [cart, setCart] = useState(/** @type {import('@/types/cart').Cart} */ ({
    items: [],
    updatedAt: new Date().toISOString(),
  }))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const next = await getCart(userId)
        if (!cancelled) setCart(next)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  const refresh = useCallback(async () => {
    const next = await getCart(userId)
    setCart(next)
    return next
  }, [userId])

  const addItem = useCallback(
    async (product, quantity = 1) => {
      const next = await addToCartService(userId, product, quantity)
      setCart(next)
      return next
    },
    [userId],
  )

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      const next = await updateQuantityService(userId, productId, quantity)
      setCart(next)
      return next
    },
    [userId],
  )

  const removeItem = useCallback(
    async (productId) => {
      const next = await removeFromCartService(userId, productId)
      setCart(next)
      return next
    },
    [userId],
  )

  const clear = useCallback(async () => {
    const next = await clearCartService(userId)
    setCart(next)
    return next
  }, [userId])

  const totals = useMemo(() => getCartTotals(cart), [cart])

  const value = useMemo(
    () => ({
      cart,
      loading,
      itemCount: totals.itemCount,
      total: totals.total,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      refresh,
    }),
    [cart, loading, totals, addItem, updateQuantity, removeItem, clear, refresh],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
