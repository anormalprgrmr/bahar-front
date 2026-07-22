import { useEffect, useRef, useState } from 'react'
import styles from './Reveal.module.css'

/**
 * @param {{
 *   children: import('react').ReactNode
 *   className?: string
 *   delay?: number
 * }} props
 */
export function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(/** @type {HTMLDivElement | null} */ (null))
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.visible : ''} ${className}`}
      style={{ '--delay': `${delay}ms` }}
    >
      {children}
    </div>
  )
}
