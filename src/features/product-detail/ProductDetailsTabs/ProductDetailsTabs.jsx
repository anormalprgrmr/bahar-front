import styles from './ProductDetailsTabs.module.css'

/**
 * @param {{ product: import('@/types/product').Product }} props
 */
export function ProductDetailsTabs({ product }) {
  return (
    <section className={styles.section}>
      <div className={styles.block}>
        <h2 className={styles.heading}>ویژگی‌ها</h2>
        {product.features?.length ? (
          <ul className={styles.features}>
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>ویژگی‌ای ثبت نشده است.</p>
        )}
      </div>

      <div className={styles.block}>
        <h2 className={styles.heading}>نحوه مصرف</h2>
        <p className={styles.text}>
          {product.usage ?? 'اطلاعات نحوه مصرف در دسترس نیست.'}
        </p>
      </div>
    </section>
  )
}
