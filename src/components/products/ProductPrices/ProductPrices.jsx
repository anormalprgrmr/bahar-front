import { formatPrice } from '@/utils/formatPrice'
import styles from './ProductPrices.module.css'

/**
 * @param {{ installmentPrice: number, compact?: boolean, large?: boolean }} props
 */
export function ProductPrices({ installmentPrice, compact = false, large = false }) {
  const cashPrice = Math.round(installmentPrice * 0.9)
  const className = [
    styles.prices,
    compact && styles.compact,
    large && styles.large,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className}>
      <div className={`${styles.option} ${styles.cash}`}>
        <span className={styles.label}>نقدی</span>
        <span className={styles.amount}>{formatPrice(cashPrice)}</span>
      </div>
      <div className={`${styles.option} ${styles.installment}`}>
        <span className={styles.label}>قسطی</span>
        <span className={styles.amount}>{formatPrice(installmentPrice)}</span>
      </div>
    </div>
  )
}
