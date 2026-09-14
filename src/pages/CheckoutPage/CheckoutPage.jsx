import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import {
  confirmMockPayment,
  createOrderFromCart,
  getOrderById,
  trackOrder,
} from '@/services/orders/orderService'
import { formatPrice } from '@/utils/formatPrice'
import { getOrderStatusLabel } from '@/utils/productHelpers'
import formStyles from '@/styles/forms.module.css'
import styles from './CheckoutPage.module.css'

const GUEST_ORDER_KEY = 'bahar_guest_order'

function saveGuestOrderAccess(order) {
  if (!order?.id || !order?.tracking_code) return
  sessionStorage.setItem(
    GUEST_ORDER_KEY,
    JSON.stringify({ id: order.id, tracking_code: order.tracking_code }),
  )
}

function readGuestOrderAccess() {
  try {
    const raw = sessionStorage.getItem(GUEST_ORDER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function CheckoutPage() {
  const { orderId } = useParams()
  const [searchParams] = useSearchParams()
  const { user, isAuthenticated, updateProfile } = useAuth()
  const { cart, total, refresh } = useCart()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [address, setAddress] = useState(user?.address ?? '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [paying, setPaying] = useState(false)
  const [mockPaid, setMockPaid] = useState(false)
  const [order, setOrder] = useState(/** @type {import('@/types/order').Order | null} */ (null))
  const [loadingOrder, setLoadingOrder] = useState(Boolean(orderId))

  useEffect(() => {
    if (user?.name) setName(user.name)
    if (user?.phone) setPhone(user.phone)
    if (user?.email) setEmail(user.email)
    if (user?.address) setAddress(user.address)
  }, [user?.name, user?.phone, user?.email, user?.address])

  useEffect(() => {
    if (!orderId) return
    let cancelled = false

    async function load() {
      setLoadingOrder(true)
      setError('')
      try {
        const trackingFromQuery = searchParams.get('tracking')
        const guestAccess = readGuestOrderAccess()
        let result = null

        if (isAuthenticated) {
          result = await getOrderById(orderId)
        }

        if (!result) {
          const code =
            trackingFromQuery ||
            (guestAccess?.id === orderId ? guestAccess.tracking_code : null)
          if (code) {
            result = await trackOrder(code)
            if (result && result.id !== orderId) result = null
          }
        }

        if (!cancelled) {
          if (!result) setError('سفارش یافت نشد.')
          else {
            setOrder(result)
            saveGuestOrderAccess(result)
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
  }, [orderId, isAuthenticated, searchParams])

  async function handleCreateOrder() {
    setError('')
    setSubmitting(true)

    try {
      const trimmedName = name.trim()
      const trimmedPhone = phone.trim()
      const trimmedEmail = email.trim()
      const trimmedAddress = address.trim()

      if (!trimmedName) throw new Error('نام الزامی است.')
      if (!trimmedPhone) throw new Error('شماره موبایل الزامی است.')
      if (!trimmedAddress) throw new Error('آدرس تحویل الزامی است.')

      if (isAuthenticated && user) {
        const profilePatch = {}
        if (trimmedAddress !== (user.address ?? '').trim()) {
          profilePatch.address = trimmedAddress
        }
        if (trimmedName !== (user.name ?? '').trim()) {
          profilePatch.name = trimmedName
        }
        if (trimmedPhone !== (user.phone ?? '').trim()) {
          profilePatch.phone = trimmedPhone
        }
        if (Object.keys(profilePatch).length > 0) {
          await updateProfile(profilePatch)
        }
      }

      const created = await createOrderFromCart(cart.items, user?.id ?? null, {
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        address: trimmedAddress,
        authenticated: isAuthenticated,
      })
      await refresh()
      setOrder(created)
      saveGuestOrderAccess(created)
      navigate(
        `/checkout/${created.id}?tracking=${encodeURIComponent(created.tracking_code)}`,
        { replace: true },
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ثبت سفارش ناموفق بود.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleMockPay() {
    if (!order) return
    setError('')
    setPaying(true)

    try {
      await confirmMockPayment(order)
      setMockPaid(true)
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

  if (order && mockPaid) {
    return (
      <div className={`container ${styles.page}`}>
        <div className={styles.successCard}>
          <h1 className={styles.successTitle}>پرداخت آزمایشی موفق بود</h1>
          <p className={styles.muted}>سفارش شما ثبت شد.</p>
          <p className={styles.ref}>
            کد پیگیری: <strong>{order.tracking_code}</strong>
          </p>
          <p className={styles.muted}>
            این کد را نگه دارید؛ با آن می‌توانید وضعیت سفارش را پیگیری کنید.
          </p>
          <p className={styles.ref}>وضعیت فعلی: {getOrderStatusLabel(order.status)}</p>
          <p className={styles.total}>{formatPrice(order.total_amount)}</p>
          <div className={styles.successActions}>
            <Link
              to={`/track?code=${encodeURIComponent(order.tracking_code)}`}
              className={styles.secondaryBtn}
            >
              پیگیری سفارش
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className={styles.secondaryBtn}>
                ساخت حساب کاربری (اختیاری)
              </Link>
            )}
            {isAuthenticated && (
              <Link to="/profile" className={styles.secondaryBtn}>
                مشاهده سفارش‌ها
              </Link>
            )}
            <Link to="/" className={styles.primaryBtn}>
              بازگشت به فروشگاه
            </Link>
          </div>
          <p className={styles.mockNote}>
            درگاه واقعی هنوز متصل نیست؛ وضعیت سفارش در سرور تا تغییر توسط مدیر
            همان وضعیت اولیه باقی می‌ماند.
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
            <p className={styles.trackingBanner}>
              کد پیگیری: <strong>{order.tracking_code}</strong>
            </p>
            <p className={styles.muted}>
              وضعیت: {getOrderStatusLabel(order.status)}
            </p>
            <ul className={styles.orderItems}>
              {(order.items ?? []).map((item) => (
                <li key={`${item.product_id}-${item.quantity}`}>
                  <span>
                    محصول {item.product_id.slice(0, 8)} ×{' '}
                    {new Intl.NumberFormat('fa-IR').format(item.quantity)}
                  </span>
                  <strong>{formatPrice(item.unit_price * item.quantity)}</strong>
                </li>
              ))}
            </ul>
            <div className={styles.totalRow}>
              <span>مبلغ قابل پرداخت</span>
              <strong>{formatPrice(order.total_amount)}</strong>
            </div>

            {error && <p className={formStyles.error}>{error}</p>}

            {order.status === 'pending' && (
              <>
                <button
                  type="button"
                  className={styles.payBtn}
                  onClick={handleMockPay}
                  disabled={paying}
                >
                  {paying ? 'در حال اتصال به درگاه...' : 'پرداخت آزمایشی'}
                </button>
                <p className={styles.mockNote}>
                  این دکمه فقط تأیید آزمایشی است و درگاه واقعی بعداً اضافه می‌شود.
                </p>
              </>
            )}
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
          <h2 className={styles.sectionTitle}>اطلاعات تحویل</h2>
          <p className={styles.muted}>
            بدون ثبت‌نام هم می‌توانید سفارش دهید. در صورت تمایل بعداً حساب بسازید.
          </p>

          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="checkout-name">
              نام و نام خانوادگی
            </label>
            <input
              id="checkout-name"
              className={formStyles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="checkout-phone">
              موبایل
            </label>
            <input
              id="checkout-phone"
              className={formStyles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              inputMode="tel"
              autoComplete="tel"
              placeholder="09xxxxxxxxx"
            />
          </div>

          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="checkout-email">
              ایمیل (اختیاری)
            </label>
            <input
              id="checkout-email"
              type="email"
              className={formStyles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="checkout-address">
              آدرس
            </label>
            <textarea
              id="checkout-address"
              className={formStyles.textarea}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              required
              placeholder="شهر، خیابان، پلاک، واحد..."
            />
          </div>

          {!isAuthenticated && (
            <p className={styles.accountHint}>
              حساب دارید؟{' '}
              <Link to="/login" state={{ from: '/checkout' }}>
                وارد شوید
              </Link>
              {' '}یا{' '}
              <Link to="/register" state={{ from: '/checkout' }}>
                ثبت‌نام کنید
              </Link>
              — اختیاری است.
            </p>
          )}

          {error && <p className={formStyles.error}>{error}</p>}
          <button
            type="button"
            className={styles.payBtn}
            onClick={handleCreateOrder}
            disabled={submitting}
          >
            {submitting ? 'در حال ثبت...' : 'ثبت سفارش و رفتن به پرداخت'}
          </button>
        </section>

        <aside className={styles.card}>
          <h2 className={styles.sectionTitle}>خلاصه سبد</h2>
          <ul className={styles.orderItems}>
            {cart.items.map((item) => (
              <li key={item.productId}>
                <span>
                  {item.name} ×{' '}
                  {new Intl.NumberFormat('fa-IR').format(item.quantity)}
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
