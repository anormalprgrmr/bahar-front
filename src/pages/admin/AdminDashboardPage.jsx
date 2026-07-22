import { Link } from 'react-router-dom'
import styles from './AdminShared.module.css'

export function AdminDashboardPage() {
  return (
    <div>
      <h1 className={styles.title}>داشبورد مدیریت</h1>
      <p className={styles.subtitle}>
        مدیریت محصولات و سفارش‌های فروشگاه بهار
      </p>
      <div className={styles.cards}>
        <Link to="/admin/products" className={styles.card}>
          <h2>محصولات</h2>
          <p>ایجاد، ویرایش و حذف محصولات</p>
        </Link>
        <Link to="/admin/orders" className={styles.card}>
          <h2>سفارش‌ها</h2>
          <p>مشاهده، تغییر وضعیت و حذف سفارش‌ها</p>
        </Link>
        <Link to="/admin/users" className={styles.card}>
          <h2>کاربران</h2>
          <p>مشاهده، ویرایش و حذف کاربران</p>
        </Link>
      </div>
    </div>
  )
}
