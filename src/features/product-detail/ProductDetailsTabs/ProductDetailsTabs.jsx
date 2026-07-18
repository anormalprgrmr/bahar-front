import styles from './ProductDetailsTabs.module.css'

/**
 * @param {{ product: import('@/types/product').Product }} props
 */
export function ProductDetailsTabs({ product }) {
  return (
    <section className={styles.section}>
      <div className={styles.block}>
        <h2 className={styles.heading}>توضیحات</h2>
        <p className={styles.text}>{product.description || 'توضیحی ثبت نشده است.'}</p>
      </div>

      <div className={styles.block}>
        <h2 className={styles.heading}>جزئیات</h2>
        <ul className={styles.features}>
          <li>دسته‌بندی: {product.category}</li>
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
