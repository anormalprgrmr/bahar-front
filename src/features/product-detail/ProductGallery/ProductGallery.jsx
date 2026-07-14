import { useState } from 'react'
import styles from './ProductGallery.module.css'

/**
 * @param {{
 *   images: string[]
 *   name: string
 *   badgeLabel?: string | null
 * }} props
 */
export function ProductGallery({ images, name, badgeLabel }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const safeImages = images.length > 0 ? images : []

  if (safeImages.length === 0) {
    return <div className={styles.empty}>بدون تصویر</div>
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        {badgeLabel && <span className={styles.badge}>{badgeLabel}</span>}
        <img
          src={safeImages[activeIndex]}
          alt={name}
          className={styles.mainImage}
        />
      </div>

      {safeImages.length > 1 && (
        <div className={styles.thumbs} role="list">
          {safeImages.map((src, index) => (
            <button
              key={src}
              type="button"
              role="listitem"
              className={`${styles.thumb} ${index === activeIndex ? styles.thumbActive : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`تصویر ${index + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
