import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getUserOrders } from '@/services/orders/orderService'
import { formatPrice } from '@/utils/formatPrice'
import formStyles from '@/styles/forms.module.css'
import styles from './ProfilePage.module.css'

const STATUS_LABELS = {
  pending: 'در انتظار پرداخت',
  paid: 'پرداخت‌شده',
  failed: 'ناموفق',
}

export function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState(user?.profile.fullName ?? '')
  const [phone, setPhone] = useState(user?.profile.phone ?? '')
  const [address, setAddress] = useState(user?.profile.address ?? '')
  const [city, setCity] = useState(user?.profile.city ?? '')
  const [postalCode, setPostalCode] = useState(user?.profile.postalCode ?? '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [orders, setOrders] = useState(/** @type {import('@/types/order').Order[]} */ ([]))
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    setFullName(user.profile.fullName)
    setPhone(user.profile.phone)
    setAddress(user.profile.address ?? '')
    setCity(user.profile.city ?? '')
    setPostalCode(user.profile.postalCode ?? '')
  }, [user])

  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function loadOrders() {
      setOrdersLoading(true)
      try {
        const result = await getUserOrders(user.id)
        if (!cancelled) setOrders(result)
      } finally {
        if (!cancelled) setOrdersLoading(false)
      }
    }

    loadOrders()
    return () => {
      cancelled = true
    }
  }, [user])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      await updateProfile({ fullName, phone, address, city, postalCode })
      setSuccess('اطلاعات شما با موفقیت ذخیره شد.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ذخیره اطلاعات ناموفق بود.')
    } finally {
      setSubmitting(false)
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
        </div>
        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
          خروج
        </button>
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>اطلاعات شخصی</h2>
          <form className={formStyles.form} onSubmit={handleSubmit}>
            {error && <p className={formStyles.error}>{error}</p>}
            {success && <p className={formStyles.success}>{success}</p>}

            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="profile-name">
                نام و نام خانوادگی
              </label>
              <input
                id="profile-name"
                className={formStyles.input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="profile-phone">
                شماره موبایل
              </label>
              <input
                id="profile-phone"
                className={formStyles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="profile-city">
                شهر
              </label>
              <input
                id="profile-city"
                className={formStyles.input}
                value={city}
                onChange={(e) => setCity(e.target.value)}
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
              />
            </div>

            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="profile-postal">
                کد پستی
              </label>
              <input
                id="profile-postal"
                className={formStyles.input}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>

            <button type="submit" className={formStyles.submit} disabled={submitting}>
              {submitting ? 'در حال ذخیره...' : 'ذخیره اطلاعات'}
            </button>
          </form>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>سفارش‌های من</h2>
          {ordersLoading && <p className={styles.muted}>در حال بارگذاری...</p>}
          {!ordersLoading && orders.length === 0 && (
            <p className={styles.muted}>هنوز سفارشی ثبت نکرده‌اید.</p>
          )}
          <ul className={styles.orderList}>
            {orders.map((order) => (
              <li key={order.id} className={styles.orderItem}>
                <div>
                  <p className={styles.orderId}>#{order.id.slice(-8)}</p>
                  <p className={styles.orderMeta}>
                    {new Date(order.createdAt).toLocaleDateString('fa-IR')} ·{' '}
                    {STATUS_LABELS[order.status]}
                  </p>
                </div>
                <div className={styles.orderSide}>
                  <span className={styles.orderTotal}>{formatPrice(order.total)}</span>
                  {order.status === 'pending' && (
                    <Link to={`/checkout/${order.id}`} className={styles.payLink}>
                      پرداخت
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
