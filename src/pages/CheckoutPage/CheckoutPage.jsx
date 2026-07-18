import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import {
  createOrderFromCart,
  getOrderById,
  payOrderMock,
} from '@/services/orders/orderService'
import { formatPrice } from '@/utils/formatPrice'
import formStyles from '@/styles/forms.module.css'
import styles from './CheckoutPage.module.css'

export function CheckoutPage() {
  const { orderId } = useParams()
  const { user } = useAuth()
  const { cart, total, refresh } = useCart()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState(user?.profile.fullName ?? '')
  const [phone, setPhone] = useState(user?.profile.phone ?? '')
  const [city, setCity] = useState(user?.profile.city ?? '')
  const [address, setAddress] = useState(user?.profile.address ?? '')
  const [postalCode, setPostalCode] = useState(user?.profile.postalCode ?? '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [paying, setPaying] = useState(false)
  const [order, setOrder] = useState(/** @type {import('@/types/order').Order | null} */ (null))
  const [loadingOrder, setLoadingOrder] = useState(Boolean(orderId))

  useEffect(() => {
    if (!user) return
    setFullName(user.profile.fullName)
    setPhone(user.profile.phone)
    setCity(user.profile.city ?? '')
    setAddress(user.profile.address ?? '')
    setPostalCode(user.profile.postalCode ?? '')
  }, [user])

  useEffect(() => {
    if (!orderId || !user) return
    let cancelled = false

    async function load() {
      setLoadingOrder(true)
      setError('')
      try {
        const result = await getOrderById(user.id, orderId)
        if (!cancelled) {
          if (!result) {
            setError('سفارش یافت نشد.')
          } else {
            setOrder(result)
          }
        }
      } finally {
        if (!cancelled) setLoadingOrder(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [orderId, user])

  async function handleCreateOrder(event) {
    event.preventDefault()
    if (!user) return

    setError('')
    setSubmitting(true)

    try {
      const created = await createOrderFromCart(user.id, {
        fullName,
        phone,
        city,
        address,
        postalCode,
      })
      setOrder(created)
      navigate(`/checkout/${created.id}`, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ثبت سفارش ناموفق بود.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleMockPay() {
    if (!user || !order) return

    setError('')
    setPaying(true)

    try {
      const paid = await payOrderMock(user.id, order.id)
      await refresh()
      setOrder(paid)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'پرداخت ناموفق بود.')
    } finally {
      setPaying(false)
    }
  }

  if (loadingOrder) {
    return (
      <div className={`container ${styles.page}`}>
        <p className={styles.muted}>در حال بارگذاری سفارش...</p>
      </div>
    )
  }

  if (order?.status === 'paid') {
    return (
      <div className={`container ${styles.page}`}>
        <div className={styles.successCard}>
          <h1 className={styles.successTitle}>پرداخت با موفقیت انجام شد</h1>
          <p className={styles.muted}>
            سفارش #{order.id.slice(-8)} ثبت و پرداخت شد.
          </p>
          <p className={styles.ref}>کد پیگیری: {order.paymentRef}</p>
          <p className={styles.total}>{formatPrice(order.total)}</p>
          <div className={styles.successActions}>
            <Link to="/profile" className={styles.secondaryBtn}>
              مشاهده سفارش‌ها
            </Link>
            <Link to="/" className={styles.primaryBtn}>
              بازگشت به فروشگاه
            </Link>
          </div>
          <p className={styles.mockNote}>
            این یک پرداخت آزمایشی است و بعداً به درگاه واقعی متصل می‌شود.
          </p>
        </div>
      </div>
    )
  }

  if (order) {
    return (
      <div className={`container ${styles.page}`}>
        <h1 className={styles.title}>پرداخت سفارش</h1>
        <div className={styles.layout}>
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>جزئیات سفارش</h2>
            <ul className={styles.orderItems}>
              {order.items.map((item) => (
                <li key={item.productId}>
                  <span>
                    {item.name} × {new Intl.NumberFormat('fa-IR').format(item.quantity)}
                  </span>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </li>
              ))}
            </ul>
            <div className={styles.totalRow}>
              <span>مبلغ قابل پرداخت</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>

            <div className={styles.shippingBox}>
              <h3>آدرس ارسال</h3>
              <p>
                {order.shipping.fullName} · {order.shipping.phone}
              </p>
              <p>
                {order.shipping.city}، {order.shipping.address}
                {order.shipping.postalCode
                  ? ` · ${order.shipping.postalCode}`
                  : ''}
              </p>
            </div>

            {error && <p className={formStyles.error}>{error}</p>}

            <button
              type="button"
              className={styles.payBtn}
              onClick={handleMockPay}
              disabled={paying}
            >
              {paying ? 'در حال اتصال به درگاه...' : 'پرداخت آزمایشی'}
            </button>
            <p className={styles.mockNote}>
              درگاه واقعی هنوز فعال نیست؛ با این دکمه پرداخت به‌صورت آزمایشی تأیید می‌شود.
            </p>
          </section>
        </div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className={`container ${styles.page}`}>
        <div className={styles.empty}>
          <h1 className={styles.title}>ثبت سفارش</h1>
          <p className={styles.muted}>سبد خرید شما خالی است.</p>
          <Link to="/cart" className={styles.primaryBtn}>
            بازگشت به سبد خرید
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>ثبت سفارش</h1>
      <div className={styles.layout}>
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>اطلاعات ارسال</h2>
          <form className={formStyles.form} onSubmit={handleCreateOrder}>
            {error && <p className={formStyles.error}>{error}</p>}

            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="ship-name">
                نام گیرنده
              </label>
              <input
                id="ship-name"
                className={formStyles.input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="ship-phone">
                شماره موبایل
              </label>
              <input
                id="ship-phone"
                className={formStyles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="ship-city">
                شهر
              </label>
              <input
                id="ship-city"
                className={formStyles.input}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="ship-address">
                آدرس
              </label>
              <textarea
                id="ship-address"
                className={formStyles.textarea}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="ship-postal">
                کد پستی
              </label>
              <input
                id="ship-postal"
                className={formStyles.input}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>

            <button type="submit" className={formStyles.submit} disabled={submitting}>
              {submitting ? 'در حال ثبت...' : 'ثبت سفارش و رفتن به پرداخت'}
            </button>
          </form>
        </section>

        <aside className={styles.card}>
          <h2 className={styles.sectionTitle}>خلاصه سبد</h2>
          <ul className={styles.orderItems}>
            {cart.items.map((item) => (
              <li key={item.productId}>
                <span>
                  {item.name} × {new Intl.NumberFormat('fa-IR').format(item.quantity)}
                </span>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </li>
            ))}
          </ul>
          <div className={styles.totalRow}>
            <span>جمع کل</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </aside>
      </div>
    </div>
  )
}
