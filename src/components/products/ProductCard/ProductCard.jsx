import { formatPrice, getBadgeLabel } from '@/utils/formatPrice'
import styles from './ProductCard.module.css'

/**
 * @param {{ product: import('@/types/product').Product }} props
 */
export function ProductCard({ product }) {
  const badgeLabel = getBadgeLabel(product.badge)

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        {badgeLabel && <span className={styles.badge}>{badgeLabel}</span>}
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <svg
              className={styles.bagIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M6 6h15l-1.5 9h-12L6 6z" />
              <path d="M6 6l-1-2H2" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            <span className={styles.overlayText}>مشاهده و خرید</span>
          </div>
        </div>
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.prices}>
          {product.originalPrice && (
            <span className={styles.originalPrice}>
              {new Intl.NumberFormat('fa-IR').format(product.originalPrice)}
            </span>
          )}
          <span className={styles.price}>{formatPrice(product.price)}</span>
        </div>
      </div>
    </article>
  )
}
