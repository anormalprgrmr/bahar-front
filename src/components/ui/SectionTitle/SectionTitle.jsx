import { Link } from 'react-router-dom'
import styles from './SectionTitle.module.css'

/**
 * @param {{
 *   title: string
 *   moreHref?: string
 *   moreLabel?: string
 * }} props
 */
export function SectionTitle({ title, moreHref, moreLabel = 'نمایش بیشتر' }) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      {moreHref ? (
        <Link to={moreHref} className={styles.moreLink}>
          {moreLabel}
        </Link>
      ) : null}
    </div>
  )
}
