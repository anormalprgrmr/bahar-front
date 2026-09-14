import { useState } from 'react'
import { getProductExtraSpecs } from '@/utils/productFields'
import styles from './ProductExtraSpecs.module.css'

/**
 * @param {{ product: import('@/types/product').Product }} props
 */
export function ProductExtraSpecs({ product }) {
  const specs = getProductExtraSpecs(product)
  const [open, setOpen] = useState(false)

  if (specs.length === 0) return null

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.toggleBtn}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {open ? 'بستن مشخصات جزئیات محصول' : 'مشاهده مشخصات جزئیات محصول'}
      </button>

      {open && (
        <dl className={styles.list}>
          {specs.map((spec) => (
            <div key={spec.label} className={styles.item}>
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
