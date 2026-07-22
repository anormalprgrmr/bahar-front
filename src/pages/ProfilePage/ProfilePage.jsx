import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getMyOrders } from '@/services/orders/orderService'
import { formatPrice } from '@/utils/formatPrice'
import { getOrderStatusLabel } from '@/utils/productHelpers'
import formStyles from '@/styles/forms.module.css'
import styles from './ProfilePage.module.css'

export function ProfilePage() {
  const { user, isAdmin, logout, updateProfile } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileSubmitting, setProfileSubmitting] = useState(false)

  const [orders, setOrders] = useState(/** @type {import('@/types/order').Order[]} */ ([]))
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState('')

  useEffect(() => {
    if (!user) return

    setName(user.name ?? '')
    setEmail(user.email ?? '')
    setPhone(user.phone ?? '')
    setAddress(user.address ?? '')
  }, [user])

  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function loadOrders() {
      setOrdersLoading(true)
      setOrdersError('')
      try {
        const result = await getMyOrders({ page: 1, pageSize: 50 })
        if (!cancelled) setOrders(result?.data ?? [])
      } catch (err) {
        if (!cancelled) {
          setOrdersError(
            err instanceof Error ? err.message : 'بارگذاری سفارش‌ها ناموفق بود.',
          )
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

  async function handleProfileSubmit(event) {
    event.preventDefault()
    setProfileError('')
    setProfileSuccess('')
    setProfileSubmitting(true)

    try {
      await updateProfile({
        name,
        email,
        phone,
        address,
        password: password || undefined,
      })
      setPassword('')
      setProfileSuccess('اطلاعات شما با موفقیت ذخیره شد.')
    } catch (err) {
      setProfileError(
        err instanceof Error ? err.message : 'ذخیره اطلاعات ناموفق بود.',
      )
    } finally {
      setProfileSubmitting(false)
    }
  }

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

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>اطلاعات شخصی</h2>
          <form className={formStyles.form} onSubmit={handleProfileSubmit}>
            {profileError && <p className={formStyles.error}>{profileError}</p>}
            {profileSuccess && <p className={formStyles.success}>{profileSuccess}</p>}

            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="profile-name">
                نام و نام خانوادگی
              </label>
              <input
                id="profile-name"
                className={formStyles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="profile-email">
                ایمیل
              </label>
              <input
                id="profile-email"
                type="email"
                className={formStyles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="profile-phone">
                شماره موبایل
              </label>
              <input
                id="profile-phone"
                type="tel"
                className={formStyles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                placeholder="۰۹۱۲۱۲۳۴۵۶۷"
              />
            </div>

            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="profile-address">
                آدرس
              </label>
              <textarea
                id="profile-address"
                className={formStyles.textarea}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="street-address"
              />
            </div>

            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="profile-password">
                رمز عبور جدید (اختیاری)
              </label>
              <input
                id="profile-password"
                type="password"
                className={formStyles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className={formStyles.submit}
              disabled={profileSubmitting}
            >
              {profileSubmitting ? 'در حال ذخیره...' : 'ذخیره اطلاعات'}
            </button>
          </form>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>سفارش‌های من</h2>
          {ordersError && <p className={styles.error}>{ordersError}</p>}
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
    </div>
  )
}
