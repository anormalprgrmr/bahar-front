import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, getBadgeLabel } from '@/utils/formatPrice'
import { getCategoryLabel, getCategoryPath } from '@/utils/productLabels'
import styles from './ProductInfo.module.css'

/**
 * @param {{ product: import('@/types/product').Product }} props
 */
export function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1)
  const badgeLabel = getBadgeLabel(product.badge)
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100,
        )
      : null

  function decreaseQuantity() {
    setQuantity((value) => Math.max(1, value - 1))
  }

  function increaseQuantity() {
    setQuantity((value) => value + 1)
  }

  return (
    <div className={styles.info}>
      <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
        <Link to="/">خانه</Link>
        <span className={styles.sep}>/</span>
        <Link to={getCategoryPath(product.category)}>
          {getCategoryLabel(product.category)}
        </Link>
        <span className={styles.sep}>/</span>
        <span className={styles.current}>{product.name}</span>
      </nav>

      <div className={styles.meta}>
        {badgeLabel && <span className={styles.badge}>{badgeLabel}</span>}
        {product.brand && (
          <span className={styles.brand}>برند: {product.brand}</span>
        )}
      </div>

      <h1 className={styles.title}>{product.name}</h1>

      <div className={styles.priceRow}>
        <span className={styles.price}>{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <span className={styles.original}>
            {new Intl.NumberFormat('fa-IR').format(product.originalPrice)} تومان
          </span>
        )}
        {discountPercent && (
          <span className={styles.discount}>{discountPercent}٪ تخفیف</span>
        )}
      </div>

      <p className={styles.description}>{product.description}</p>

      <dl className={styles.specs}>
        {product.volume && (
          <div className={styles.spec}>
            <dt>حجم</dt>
            <dd>{product.volume}</dd>
          </div>
        )}
        <div className={styles.spec}>
          <dt>دسته‌بندی</dt>
          <dd>{getCategoryLabel(product.category)}</dd>
        </div>
        <div className={styles.spec}>
          <dt>موجودی</dt>
          <dd className={product.inStock === false ? styles.outOfStock : styles.inStock}>
            {product.inStock === false ? 'ناموجود' : 'موجود در انبار'}
          </dd>
        </div>
        <div className={styles.spec}>
          <dt>فروش</dt>
          <dd>
            {new Intl.NumberFormat('fa-IR').format(product.salesCount)} فروش
          </dd>
        </div>
      </dl>

      <div className={styles.actions}>
        <div className={styles.quantity}>
          <button
            type="button"
            onClick={decreaseQuantity}
            aria-label="کاهش تعداد"
            disabled={quantity <= 1}
          >
            −
          </button>
          <span aria-live="polite">{new Intl.NumberFormat('fa-IR').format(quantity)}</span>
          <button type="button" onClick={increaseQuantity} aria-label="افزایش تعداد">
            +
          </button>
        </div>

        <button
          type="button"
          className={styles.addToCart}
          disabled={product.inStock === false}
        >
          {product.inStock === false ? 'ناموجود' : 'افزودن به سبد خرید'}
        </button>
      </div>
    </div>
  )
}
