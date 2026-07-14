import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ProductsDropdown } from './ProductsDropdown'
import styles from './MobileMenu.module.css'

/**
 * @param {{
 *   hotProducts: import('@/types/product').Product[]
 *   bestsellers: import('@/types/product').Product[]
 *   isOpen: boolean
 *   onClose: () => void
 * }} props
 */
export function MobileMenu({ hotProducts, bestsellers, isOpen, onClose }) {
  const [expandedSection, setExpandedSection] = useState(null)

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <nav className={styles.menu} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.menuTitle}>منو</span>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="بستن منو"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <ul className={styles.links}>
          <li>
            <NavLink to="/" className={styles.link} onClick={onClose}>
              خانه
            </NavLink>
          </li>
          <li>
            <button
              type="button"
              className={styles.expandBtn}
              onClick={() =>
                setExpandedSection(expandedSection === 'products' ? null : 'products')
              }
            >
              محصولات
              <svg
                className={`${styles.chevron} ${expandedSection === 'products' ? styles.chevronOpen : ''}`}
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {expandedSection === 'products' && (
              <div className={styles.submenu}>
                <p className={styles.subTitle}>محصولات داغ</p>
                {hotProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className={styles.subLink}
                    onClick={onClose}
                  >
                    {product.name}
                  </Link>
                ))}
                <p className={styles.subTitle}>پرفروش‌ترین‌ها</p>
                {bestsellers.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className={styles.subLink}
                    onClick={onClose}
                  >
                    {product.name}
                  </Link>
                ))}
              </div>
            )}
          </li>
          <li>
            <NavLink to="/makeup" className={styles.link} onClick={onClose}>
              آرایشی
            </NavLink>
          </li>
          <li>
            <NavLink to="/skincare" className={styles.link} onClick={onClose}>
              پوستی
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  )
}
