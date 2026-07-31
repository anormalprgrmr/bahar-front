import { INSTAGRAM_URL } from '@/constants/contact'
import styles from './ProductAskLink.module.css'

/**
 * @param {{ productName?: string, className?: string }} props
 */
export function ProductAskLink({ productName, className = '' }) {
  return (
    <a
      href={INSTAGRAM_URL}
      className={`${styles.link} ${className}`.trim()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      title={productName ? `سوال درباره ${productName}` : undefined}
    >
      هنوز مطمئن نیستی؟ ازم بپرس.
    </a>
  )
}
