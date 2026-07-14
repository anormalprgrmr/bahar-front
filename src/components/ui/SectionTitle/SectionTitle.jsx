import styles from './SectionTitle.module.css'

/**
 * @param {{ title: string }} props
 */
export function SectionTitle({ title }) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
    </div>
  )
}
