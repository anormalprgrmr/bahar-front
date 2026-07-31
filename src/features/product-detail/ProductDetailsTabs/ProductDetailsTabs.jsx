import { useCategories } from '@/hooks/useCategories'
import { getCategoryLabel } from '@/utils/productHelpers'
import { ProductExtraSpecs } from '@/components/products/ProductExtraSpecs/ProductExtraSpecs'
import { getProductExtraSpecs } from '@/utils/productFields'
import styles from './ProductDetailsTabs.module.css'

/**
 * @param {{ product: import('@/types/product').Product }} props
 */
export function ProductDetailsTabs({ product }) {
  const { categories } = useCategories()
  const extraSpecs = getProductExtraSpecs(product)
  const showDetails = extraSpecs.length > 0 || product.category || product.onSale

  if (!showDetails) return null

  return (
    <section className={styles.section}>
      <div className={styles.block}>
        <h2 className={styles.heading}>جزئیات بیشتر</h2>
        <ProductExtraSpecs product={product} />
        <ul className={styles.features}>
          {product.category && (
            <li>دسته‌بندی: {getCategoryLabel(product.category, categories)}</li>
          )}
          {product.onSale && <li>این محصول در تخفیف است</li>}
        </ul>
      </div>
    </section>
  )
}
