import { Link } from 'react-router-dom'
import styles from './PlaceholderPage.module.css'

/**
 * @param {{ title: string }} props
 */
export function PlaceholderPage({ title }) {
  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.text}>این صفحه به‌زودی اضافه می‌شود.</p>
      <Link to="/" className={styles.link}>
        بازگشت به صفحه اصلی
      </Link>
    </div>
  )
}
