import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ProductSearchForm } from '@/components/products/ProductSearchForm/ProductSearchForm'
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
  const { isAuthenticated, isAdmin, user, logout } = useAuth()

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
    }
  }, [isOpen])

  if (!isOpen) return null

  async function handleLogout() {
    await logout()
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <nav
        className={styles.menu}
        onClick={(event) => event.stopPropagation()}
        aria-label="منوی موبایل"
      >
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

        <div className={styles.searchWrap}>
          <ProductSearchForm onSubmit={onClose} />
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
            <NavLink to="/shop" className={styles.link} onClick={onClose}>
              دسته‌بندی‌ها
            </NavLink>
          </li>
          <li>
            <NavLink to="/wishlist" className={styles.link} onClick={onClose}>
              علاقه‌مندی‌ها
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className={styles.link} onClick={onClose}>
              سبد خرید
            </NavLink>
          </li>
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <li>
                  <NavLink to="/admin" className={styles.link} onClick={onClose}>
                    پنل مدیریت
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink to="/profile" className={styles.link} onClick={onClose}>
                  حساب من ({user?.email})
                </NavLink>
              </li>
              <li>
                <button type="button" className={styles.link} onClick={handleLogout}>
                  خروج
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={styles.link} onClick={onClose}>
                  ورود
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={styles.link} onClick={onClose}>
                  ثبت‌نام
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  )
}
