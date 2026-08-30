import { useState } from 'react'
import { useWishlist } from '@/contexts/WishlistContext'
import styles from './WishlistButton.module.css'

function BookmarkIcon({ filled = false }) {
  if (filled) {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z" />
    </svg>
  )
}

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
      aria-pressed={saved}
      title={saved ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
    >
      <BookmarkIcon filled={saved} />
      {!compact && <span>{saved ? 'ذخیره شد' : 'علاقه‌مندی'}</span>}
    </button>
  )
}
