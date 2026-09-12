import styles from './SiteBanner.module.css'

export function SiteBanner() {
  return (
    <div className={styles.banner} role="status">
      <p className={styles.text}>ضمانت مرجوعی در صورت اصل نبودن محصولات</p>
    </div>
  )
}
