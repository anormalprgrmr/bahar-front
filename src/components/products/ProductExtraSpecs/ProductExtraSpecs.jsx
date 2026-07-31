import { getProductExtraSpecs } from '@/utils/productFields'
import styles from './ProductExtraSpecs.module.css'

/**
 * @param {{ product: import('@/types/product').Product }} props
 */
export function ProductExtraSpecs({ product }) {
  const specs = getProductExtraSpecs(product)
  if (specs.length === 0) return null

  return (
    <dl className={styles.list}>
      {specs.map((spec) => (
        <div key={spec.label} className={styles.item}>
          <dt>{spec.label}</dt>
          <dd>{spec.value}</dd>
        </div>
      ))}
    </dl>
  )
}
