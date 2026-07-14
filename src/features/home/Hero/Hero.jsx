import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.banner}>
          <div className={styles.decorations} aria-hidden="true">
            <span className={styles.star}>✦</span>
            <span className={styles.heart}>♥</span>
            <span className={styles.cross}>+</span>
            <span className={styles.star2}>✦</span>
            <span className={styles.heart2}>♥</span>
          </div>

          <p className={styles.tagline}>keep going</p>

          <div className={styles.illustration}>
            <svg viewBox="0 0 200 200" className={styles.bunny} aria-hidden="true">
              <ellipse cx="100" cy="170" rx="60" ry="12" fill="rgba(0,0,0,0.06)" />
              <ellipse cx="100" cy="130" rx="55" ry="50" fill="#fff" />
              <ellipse cx="65" cy="55" rx="18" ry="45" fill="#fff" transform="rotate(-15 65 55)" />
              <ellipse cx="135" cy="55" rx="18" ry="45" fill="#fff" transform="rotate(15 135 55)" />
              <ellipse cx="65" cy="55" rx="10" ry="35" fill="#fce7f0" transform="rotate(-15 65 55)" />
              <ellipse cx="135" cy="55" rx="10" ry="35" fill="#fce7f0" transform="rotate(15 135 55)" />
              <circle cx="85" cy="120" r="5" fill="#333" />
              <circle cx="115" cy="120" r="5" fill="#333" />
              <ellipse cx="100" cy="132" rx="6" ry="4" fill="#f48fb1" />
              <ellipse cx="72" cy="128" rx="10" ry="6" fill="#fce7f0" opacity="0.8" />
              <ellipse cx="128" cy="128" rx="10" ry="6" fill="#fce7f0" opacity="0.8" />
              <rect x="130" y="110" width="30" height="50" rx="6" fill="#f48fb1" />
              <rect x="133" y="115" width="24" height="38" rx="3" fill="#fce7f0" />
              <circle cx="145" cy="130" r="3" fill="#e91e8c" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
