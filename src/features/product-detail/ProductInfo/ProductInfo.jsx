import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { useCategories } from '@/hooks/useCategories'
import { formatPrice } from '@/utils/formatPrice'
import {
  getCategoryLabel,
  getCategoryPath,
  getOriginalPrice,
  getPrimaryCategorySlug,
  getProductBadge,
  getSalePrice,
  isInStock,
} from '@/utils/productHelpers'
import { ProductAskLink } from '@/components/products/ProductAskLink/ProductAskLink'
import { ProductExtraSpecs } from '@/components/products/ProductExtraSpecs/ProductExtraSpecs'
import { ProductKeywords } from '@/components/products/ProductKeywords/ProductKeywords'
import { WishlistButton } from '@/components/products/WishlistButton/WishlistButton'
import styles from './ProductInfo.module.css'

/**
 * @param {{ product: import('@/types/product').Product }} props
 */
export function ProductInfo({ product }) {
  const { addItem } = useCart()
  const { categories } = useCategories()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const badgeLabel = getProductBadge(product)
  const salePrice = getSalePrice(product)
  const originalPrice = getOriginalPrice(product)
  const inStock = isInStock(product)
  const discountPercent =
    originalPrice != null && originalPrice > salePrice
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : null

  function decreaseQuantity() {
    setQuantity((value) => Math.max(1, value - 1))
  }

  function increaseQuantity() {
    setQuantity((value) => Math.min(product.stock || 99, value + 1))
  }

  async function handleAddToCart() {
    if (!inStock || adding) return

    setAdding(true)
    try {
      await addItem(product, quantity)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } finally {
      setAdding(false)
    }
  }

  const primaryCategorySlug = getPrimaryCategorySlug(product)
  const categoryItems =
    product.categories?.length
      ? product.categories
      : primaryCategorySlug
        ? [{ slug: primaryCategorySlug, name: getCategoryLabel(primaryCategorySlug, categories) }]
        : []

  return (
    <div className={styles.info}>
      <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
        <Link to="/">خانه</Link>
        <span className={styles.sep}>/</span>
        {categoryItems.length > 0 ? (
          <>
            <Link to={getCategoryPath(categoryItems[0].slug)}>
              {categoryItems[0].name ?? getCategoryLabel(categoryItems[0].slug, categories)}
            </Link>
            <span className={styles.sep}>/</span>
          </>
        ) : null}
        <span className={styles.current}>{product.name}</span>
      </nav>

      <div className={styles.meta}>
        {badgeLabel && <span className={styles.badge}>{badgeLabel}</span>}
      </div>

      <h1 className={styles.title}>{product.name}</h1>

      <div className={styles.priceRow}>
        <span className={styles.price}>{formatPrice(salePrice)}</span>
        {originalPrice != null && (
          <span className={styles.original}>
            {new Intl.NumberFormat('fa-IR').format(originalPrice)} تومان
          </span>
        )}
        {discountPercent && (
          <span className={styles.discount}>{discountPercent}٪ تخفیف</span>
        )}
      </div>

      <p className={styles.description}>{product.description}</p>

      <ProductExtraSpecs product={product} />
      <ProductKeywords product={product} />

      <dl className={styles.specs}>
        <div className={styles.spec}>
          <dt>دسته‌بندی</dt>
          <dd>
            {categoryItems.length > 0
              ? categoryItems.map((category, index) => (
                  <span key={category.id ?? category.slug}>
                    {index > 0 ? '، ' : ''}
                    <Link to={getCategoryPath(category.slug)}>
                      {category.name ?? getCategoryLabel(category.slug, categories)}
                    </Link>
                  </span>
                ))
              : '—'}
          </dd>
        </div>
        <div className={styles.spec}>
          <dt>موجودی</dt>
          <dd className={inStock ? styles.inStock : styles.outOfStock}>
            {inStock
              ? `${new Intl.NumberFormat('fa-IR').format(product.stock)} عدد`
              : 'ناموجود'}
          </dd>
        </div>
      </dl>

      <div className={styles.secondaryActions}>
        <ProductAskLink productName={product.name} />
        <WishlistButton product={product} />
      </div>

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
          <span aria-live="polite">
            {new Intl.NumberFormat('fa-IR').format(quantity)}
          </span>
          <button
            type="button"
            onClick={increaseQuantity}
            aria-label="افزایش تعداد"
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>

        <button
          type="button"
          className={styles.addToCart}
          disabled={!inStock || adding}
          onClick={handleAddToCart}
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

      {added && (
        <button
          type="button"
          className={styles.goToCart}
          onClick={() => navigate('/cart')}
        >
          مشاهده سبد خرید
        </button>
      )}
    </div>
  )
}
