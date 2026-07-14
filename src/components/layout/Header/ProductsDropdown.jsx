import { Link } from 'react-router-dom'
import { formatPrice } from '@/utils/formatPrice'
import styles from './ProductsDropdown.module.css'

/**
 * @param {{
 *   hotProducts: import('@/types/product').Product[]
 *   bestsellers: import('@/types/product').Product[]
 * }} props
 */
export function ProductsDropdown({ hotProducts, bestsellers }) {
  return (
    <div className={styles.dropdown}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>محصولات داغ</h3>
        <ul className={styles.list}>
          {hotProducts.map((product) => (
            <li key={product.id}>
              <Link to={`/products/${product.id}`} className={styles.item}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.thumb}
                />
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{product.name}</span>
                  <span className={styles.itemPrice}>
                    {formatPrice(product.price)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>پرفروش‌ترین‌ها</h3>
        <ul className={styles.list}>
          {bestsellers.map((product) => (
            <li key={product.id}>
              <Link to={`/products/${product.id}`} className={styles.item}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.thumb}
                />
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{product.name}</span>
                  <span className={styles.itemPrice}>
                    {formatPrice(product.price)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
