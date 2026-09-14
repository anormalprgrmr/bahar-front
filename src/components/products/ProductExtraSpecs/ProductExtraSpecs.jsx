import { useState } from 'react'
import { getProductExtraSpecs } from '@/utils/productFields'
import styles from './ProductExtraSpecs.module.css'

const PREVIEW_LENGTH = 160

/**
 * @param {{ product: import('@/types/product').Product }} props
 */
export function ProductExtraSpecs({ product }) {
  const specs = getProductExtraSpecs(product)
  const [expanded, setExpanded] = useState(/** @type {Record<string, boolean>} */ ({}))

  if (specs.length === 0) return null

  return (
    <dl className={styles.list}>
      {specs.map((spec) => {
        const needsTruncation = spec.value.length > PREVIEW_LENGTH
        const isOpen = Boolean(expanded[spec.label])
        const visibleValue =
          !needsTruncation || isOpen
            ? spec.value
            : `${spec.value.slice(0, PREVIEW_LENGTH).trim()}…`

        return (
          <div key={spec.label} className={styles.item}>
            <dt>{spec.label}</dt>
            <dd>{visibleValue}</dd>
            {needsTruncation && (
              <button
                type="button"
                className={styles.seeMore}
                onClick={() =>
                  setExpanded((current) => ({
                    ...current,
                    [spec.label]: !current[spec.label],
                  }))
                }
              >
                {isOpen ? 'بستن' : 'مشاهده بیشتر'}
              </button>
            )}
          </div>
        )
      })}
    </dl>
  )
}
