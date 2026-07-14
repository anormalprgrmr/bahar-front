import styles from './ContactSection.module.css'

export function ContactSection() {
  return (
    <section className={styles.section} id="contact">
      <div className="container">
        <div className={styles.wrapper}>
          <h2 className={styles.title}>تماس با ما:</h2>
        </div>
      </div>
    </section>
  )
}
