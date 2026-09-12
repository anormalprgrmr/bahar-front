import styles from './ProductPurchaseActions.module.css'

/**
 * @param {{
 *   quantity: number
 *   stock: number
 *   inStock: boolean
 *   adding: boolean
 *   added: boolean
 *   onDecrease: () => void
 *   onIncrease: () => void
 *   onAddToCart: () => void
 *   onGoToCart?: () => void
 *   compact?: boolean
 * }} props
 */
export function ProductPurchaseActions({
  quantity,
  stock,
  inStock,
  adding,
  added,
  onDecrease,
  onIncrease,
  onAddToCart,
  onGoToCart,
  compact = false,
}) {
  return (
    <div className={`${styles.wrap} ${compact ? styles.compact : ''}`}>
      <div className={styles.actions}>
        <div className={styles.quantity}>
          <button
            type="button"
            onClick={onDecrease}
            aria-label="کاهش تعداد"
            disabled={quantity <= 1}
          >
            −
          </button>
          <span aria-live="polite">
            {new Intl.NumberFormat('fa-IR').format(quantity)}
          </span>
          <button
            type="button"
            onClick={onIncrease}
            aria-label="افزایش تعداد"
            disabled={quantity >= stock}
          >
            +
          </button>
        </div>

        <button
          type="button"
          className={styles.addToCart}
          disabled={!inStock || adding}
          onClick={onAddToCart}
        >
          {!inStock
            ? 'ناموجود'
            : adding
              ? 'در حال افزودن...'
              : added
                ? 'به سبد اضافه شد ✓'
                : 'افزودن به سبد خرید'}
        </button>
      </div>

      {added && onGoToCart ? (
        <button type="button" className={styles.goToCart} onClick={onGoToCart}>
          مشاهده سبد خرید
        </button>
      ) : null}
    </div>
  )
}
