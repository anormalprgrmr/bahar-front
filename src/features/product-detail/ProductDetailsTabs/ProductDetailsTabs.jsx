import { useCategories } from '@/hooks/useCategories'
import { getCategoryLabel } from '@/utils/productHelpers'
import styles from './ProductDetailsTabs.module.css'

/**
 * @param {{ product: import('@/types/product').Product }} props
 */
export function ProductDetailsTabs({ product }) {
  const { categories } = useCategories()

  return (
    <section className={styles.section}>
      <div className={styles.block}>
        <h2 className={styles.heading}>توضیحات</h2>
        <p className={styles.text}>{product.description || 'توضیحی ثبت نشده است.'}</p>
      </div>

      <div className={styles.block}>
        <h2 className={styles.heading}>جزئیات</h2>
        <ul className={styles.features}>
          <li>دسته‌بندی: {getCategoryLabel(product.category, categories)}</li>
          <li>
            موجودی:{' '}
            {new Intl.NumberFormat('fa-IR').format(product.stock ?? 0)} عدد
          </li>
          {product.onSale && <li>این محصول در تخفیف است</li>}
        </ul>
      </div>
    </section>
  )
}
