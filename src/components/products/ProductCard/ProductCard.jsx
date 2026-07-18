import { Link } from 'react-router-dom'
import { formatPrice } from '@/utils/formatPrice'
import {
  getOriginalPrice,
  getProductBadge,
  getSalePrice,
} from '@/utils/productHelpers'
import styles from './ProductCard.module.css'

/**
 * @param {{ product: import('@/types/product').Product }} props
 */
export function ProductCard({ product }) {
  const badgeLabel = getProductBadge(product)
  const salePrice = getSalePrice(product)
  const originalPrice = getOriginalPrice(product)

  return (
    <article className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.link}>
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
            {originalPrice != null && (
              <span className={styles.originalPrice}>
                {new Intl.NumberFormat('fa-IR').format(originalPrice)}
              </span>
            )}
            <span className={styles.price}>{formatPrice(salePrice)}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
