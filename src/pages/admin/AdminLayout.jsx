import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import styles from './AdminLayout.module.css'

export function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link to="/admin" className={styles.brand}>
          پنل مدیریت بهار
        </Link>
        <nav className={styles.nav}>
          <NavLink to="/admin" end className={styles.link}>
            داشبورد
          </NavLink>
          <NavLink to="/admin/products" className={styles.link}>
            محصولات
          </NavLink>
          <NavLink to="/admin/categories" className={styles.link}>
            دسته‌بندی‌ها
          </NavLink>
          <NavLink to="/admin/orders" className={styles.link}>
            سفارش‌ها
          </NavLink>
          <NavLink to="/admin/users" className={styles.link}>
            کاربران
          </NavLink>
          <NavLink to="/admin/backup" className={styles.link}>
            پشتیبان‌گیری
          </NavLink>
        </nav>
        <div className={styles.footer}>
          <p className={styles.email}>{user?.email}</p>
          <Link to="/" className={styles.storeLink}>
            مشاهده فروشگاه
          </Link>
          <button type="button" className={styles.logout} onClick={() => logout()}>
            خروج
          </button>
        </div>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
