import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import {
  getHotProducts,
  getBestsellerProducts,
} from '@/services/products/productService'
import { ProductsDropdown } from './ProductsDropdown'
import { MobileMenu } from './MobileMenu'
import styles from './Header.module.css'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6h15l-1.5 9h-12L6 6z" />
      <path d="M6 6l-1-2H2" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function LogoIcon() {
  return (
    <svg className={styles.logoIcon} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="#fce7f0" />
      <path
        d="M20 8c-1.5 6-6 9-10 11 4.5 1.5 9 4.5 10 11 1-6.5 5.5-9.5 10-11-4-2-8.5-5-10-11z"
        fill="#e91e8c"
      />
      <circle cx="20" cy="20" r="4" fill="#f48fb1" />
    </svg>
  )
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { isAuthenticated, isAdmin, user } = useAuth()
  const { itemCount } = useCart()

  const { data: hotProducts = [] } = useAsyncData('hot', getHotProducts)
  const { data: bestsellers = [] } = useAsyncData('bestsellers', getBestsellerProducts)

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.actions}>
          <button type="button" className={styles.iconBtn} aria-label="جستجو">
            <SearchIcon />
          </button>

          <Link to="/cart" className={styles.iconBtn} aria-label="سبد خرید">
            <CartIcon />
            {itemCount > 0 && (
              <span className={styles.badge}>
                {new Intl.NumberFormat('fa-IR').format(itemCount)}
              </span>
            )}
          </Link>

          {isAdmin && (
            <Link to="/admin" className={styles.adminChip}>
              پنل مدیریت
            </Link>
          )}

          <Link
            to={isAuthenticated ? '/profile' : '/login'}
            className={styles.iconBtn}
            aria-label={isAuthenticated ? 'حساب کاربری' : 'ورود'}
            title={isAuthenticated ? user?.email : 'ورود'}
          >
            <UserIcon />
          </Link>

          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setMenuOpen(true)}
            aria-label="باز کردن منو"
          >
            <MenuIcon />
          </button>
        </div>

        <nav className={styles.nav}>
          <NavLink to="/" className={styles.navLink} end>
            خانه
          </NavLink>

          <div
            className={styles.dropdownWrapper}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              className={`${styles.navLink} ${styles.navLinkBtn}`}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              محصولات
              <svg
                className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`}
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {dropdownOpen && (
              <ProductsDropdown
                hotProducts={hotProducts}
                bestsellers={bestsellers}
              />
            )}
          </div>

          <NavLink to="/makeup" className={styles.navLink}>
            آرایشی
          </NavLink>
          <NavLink to="/skincare" className={styles.navLink}>
            پوستی
          </NavLink>
        </nav>

        <Link to="/" className={styles.brand}>
          <LogoIcon />
          <span className={styles.brandText}>
            <span className={styles.brandName}>بهار</span>
            <span className={styles.brandSub}>محصولات مراقبتی و آرایشی</span>
          </span>
        </Link>
      </div>

      <MobileMenu
        hotProducts={hotProducts}
        bestsellers={bestsellers}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  )
}
