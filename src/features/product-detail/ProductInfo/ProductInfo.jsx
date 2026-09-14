import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'
import { formatPrice } from '@/utils/formatPrice'
import {
  getCategoryLabel,
  getCategoryPath,
  getOriginalPrice,
  getPrimaryCategorySlug,
  getProductBadge,
  getSalePrice,
} from '@/utils/productHelpers'
import { ProductAskLink } from '@/components/products/ProductAskLink/ProductAskLink'
import { ProductExtraSpecs } from '@/components/products/ProductExtraSpecs/ProductExtraSpecs'
import { ProductKeywords } from '@/components/products/ProductKeywords/ProductKeywords'
import { WishlistButton } from '@/components/products/WishlistButton/WishlistButton'
import styles from './ProductInfo.module.css'

const DESCRIPTION_PREVIEW_LENGTH = 180

/**
 * @param {{
 *   product: import('@/types/product').Product
 * }} props
 */
export function ProductInfo({ product }) {
  const { categories } = useCategories()
  const [descExpanded, setDescExpanded] = useState(false)

  const badgeLabel = getProductBadge(product)
  const salePrice = getSalePrice(product)
  const originalPrice = getOriginalPrice(product)
  const discountPercent =
    originalPrice != null && originalPrice > salePrice
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : null

  const description = product.description?.trim() ?? ''
  const needsTruncation = description.length > DESCRIPTION_PREVIEW_LENGTH
  const visibleDescription =
    !needsTruncation || descExpanded
      ? description
      : `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trim()}…`

  const primaryCategorySlug = getPrimaryCategorySlug(product)
  const categoryItems =
    product.categories?.length
      ? product.categories
      : primaryCategorySlug
        ? [{ slug: primaryCategorySlug, name: getCategoryLabel(primaryCategorySlug, categories) }]
        : []

  return (
    <div className={styles.info}>
      <div className={styles.topBar}>
        <WishlistButton product={product} />
        <ProductAskLink productName={product.name} iconOnly />
      </div>

      <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
        <Link to="/">خانه</Link>
        <span className={styles.sep}>/</span>
        {categoryItems.length > 0 ? (
          <>
            <Link to={getCategoryPath(categoryItems[0].slug)}>
              {categoryItems[0].name ??
                getCategoryLabel(categoryItems[0].slug, categories)}
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

      <div className={styles.descriptionBlock}>
        <p className={styles.description}>{visibleDescription}</p>
        {needsTruncation && (
          <button
            type="button"
            className={styles.seeMore}
            onClick={() => setDescExpanded((value) => !value)}
          >
            {descExpanded ? 'بستن' : 'مشاهده بیشتر'}
          </button>
        )}
      </div>

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
                      {category.name ??
                        getCategoryLabel(category.slug, categories)}
                    </Link>
                  </span>
                ))
              : '—'}
          </dd>
        </div>
        <div className={styles.spec}>
          <dt>موجودی</dt>
          <dd>
            {(product.stock ?? 0) > 0
              ? `${new Intl.NumberFormat('fa-IR').format(product.stock)} عدد`
              : 'ناموجود'}
          </dd>
        </div>
      </dl>
    </div>
  )
}
