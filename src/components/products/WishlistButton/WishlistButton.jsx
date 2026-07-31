import { useState } from 'react'
import { useWishlist } from '@/contexts/WishlistContext'
import styles from './WishlistButton.module.css'

/**
 * @param {{
 *   product: import('@/types/product').Product
 *   compact?: boolean
 * }} props
 */
export function WishlistButton({ product, compact = false }) {
  const { isSaved, toggleItem } = useWishlist()
  const [busy, setBusy] = useState(false)
  const saved = isSaved(product.id)

  async function handleClick(event) {
    event.preventDefault()
    event.stopPropagation()
    if (busy) return

    setBusy(true)
    try {
      await toggleItem(product)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${saved ? styles.saved : ''} ${compact ? styles.compact : ''}`}
      onClick={handleClick}
      disabled={busy}
      aria-label={saved ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
      title={saved ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M12 21s-7.2-4.7-9.8-8.4C.1 9.8 1.2 6.4 4.4 5.2c2-.8 4.2.1 5.4 1.8 1.2-1.7 3.4-2.6 5.4-1.8 3.2 1.2 4.3 4.6 2.2 7.4C19.2 16.3 12 21 12 21z" />
      </svg>
      {!compact && <span>{saved ? 'ذخیره شد' : 'علاقه‌مندی'}</span>}
    </button>
  )
}
