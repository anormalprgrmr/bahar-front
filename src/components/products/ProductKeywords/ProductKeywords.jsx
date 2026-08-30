import { parseProductKeywords } from '@/utils/productKeywords'
import styles from './ProductKeywords.module.css'

/**
 * @param {{ product: import('@/types/product').Product }} props
 */
export function ProductKeywords({ product }) {
  const keywords = parseProductKeywords(product.keywords)
  if (keywords.length === 0) return null

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>کلمات کلیدی</span>
      <div className={styles.tags}>
        {keywords.map((keyword) => (
          <span key={keyword} className={styles.tag}>
            {keyword}
          </span>
        ))}
      </div>
    </div>
  )
}
