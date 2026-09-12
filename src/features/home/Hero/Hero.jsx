import { useEffect, useState } from 'react'
import { useAsyncData } from '@/hooks/useAsyncData'
import { listSliderImages } from '@/services/homeSlider/homeSliderService'
import styles from './Hero.module.css'

export function Hero() {
  const { data, loading } = useAsyncData('home-slider', listSliderImages)
  const slides = data ?? []
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 4500)
    return () => window.clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    setActiveIndex(0)
  }, [slides])

  if (loading) {
    return (
      <section className={styles.hero}>
        <div className={`container ${styles.inner}`}>
          <div className={`${styles.banner} ${styles.bannerLoading}`} />
        </div>
      </section>
    )
  }

  if (slides.length === 0) {
    return (
      <section className={styles.hero}>
        <div className={`container ${styles.inner}`}>
          <div className={`${styles.banner} ${styles.bannerFallback}`}>
            <p className={styles.fallbackText}>بهار آرایشی</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.banner}>
          {slides.map((slide, index) => (
            <img
              key={slide.id}
              src={slide.imageUrl}
              alt=""
              className={`${styles.slideImage} ${index === activeIndex ? styles.slideActive : ''}`}
            />
          ))}

          {slides.length > 1 && (
            <div className={styles.dots} role="tablist" aria-label="اسلایدر">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
                  aria-label={`اسلاید ${index + 1}`}
                  aria-selected={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
