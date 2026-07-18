import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getMyOrders } from '@/services/orders/orderService'
import { formatPrice } from '@/utils/formatPrice'
import { getOrderStatusLabel } from '@/utils/productHelpers'
import styles from './ProfilePage.module.css'

export function ProfilePage() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState(/** @type {import('@/types/order').Order[]} */ ([]))
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function loadOrders() {
      setOrdersLoading(true)
      setError('')
      try {
        const result = await getMyOrders({ page: 1, pageSize: 50 })
        if (!cancelled) setOrders(result?.data ?? [])
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'بارگذاری سفارش‌ها ناموفق بود.')
        }
      } finally {
        if (!cancelled) setOrdersLoading(false)
      }
    }

    loadOrders()
    return () => {
      cancelled = true
    }
  }, [user])

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>حساب کاربری</h1>
          <p className={styles.email}>{user?.email}</p>
          {isAdmin && <span className={styles.adminBadge}>مدیر</span>}
        </div>
        <div className={styles.headerActions}>
          {isAdmin && (
            <Link to="/admin" className={styles.adminLink}>
              پنل مدیریت
            </Link>
          )}
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            خروج
          </button>
        </div>
      </div>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>سفارش‌های من</h2>
        {error && <p className={styles.error}>{error}</p>}
        {ordersLoading && <p className={styles.muted}>در حال بارگذاری...</p>}
        {!ordersLoading && orders.length === 0 && (
          <p className={styles.muted}>هنوز سفارشی ثبت نکرده‌اید.</p>
        )}
        <ul className={styles.orderList}>
          {orders.map((order) => (
            <li key={order.id} className={styles.orderItem}>
              <div>
                <p className={styles.orderId}>#{order.id.slice(0, 8)}</p>
                <p className={styles.orderMeta}>
                  {new Date(order.created_at).toLocaleDateString('fa-IR')} ·{' '}
                  {getOrderStatusLabel(order.status)}
                </p>
              </div>
              <div className={styles.orderSide}>
                <span className={styles.orderTotal}>
                  {formatPrice(order.total_amount)}
                </span>
                <Link to={`/checkout/${order.id}`} className={styles.payLink}>
                  جزئیات
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
