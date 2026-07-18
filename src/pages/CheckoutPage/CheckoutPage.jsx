import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import {
  confirmMockPayment,
  createOrderFromCart,
  getOrderById,
} from '@/services/orders/orderService'
import { formatPrice } from '@/utils/formatPrice'
import { getOrderStatusLabel } from '@/utils/productHelpers'
import formStyles from '@/styles/forms.module.css'
import styles from './CheckoutPage.module.css'

export function CheckoutPage() {
  const { orderId } = useParams()
  const { user } = useAuth()
  const { cart, total, refresh } = useCart()
  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [paying, setPaying] = useState(false)
  const [mockPaid, setMockPaid] = useState(false)
  const [order, setOrder] = useState(/** @type {import('@/types/order').Order | null} */ (null))
  const [loadingOrder, setLoadingOrder] = useState(Boolean(orderId))

  useEffect(() => {
    if (!orderId || !user) return
    let cancelled = false

    async function load() {
      setLoadingOrder(true)
      setError('')
      try {
        const result = await getOrderById(orderId)
        if (!cancelled) {
          if (!result) setError('سفارش یافت نشد.')
          else setOrder(result)
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

  async function handleCreateOrder() {
    if (!user) return
    setError('')
    setSubmitting(true)

    try {
      const created = await createOrderFromCart(cart.items, user.id)
      await refresh()
      setOrder(created)
      navigate(`/checkout/${created.id}`, { replace: true })
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
          <p className={styles.muted}>
            سفارش #{order.id.slice(0, 8)} ثبت شد.
          </p>
          <p className={styles.ref}>وضعیت فعلی: {getOrderStatusLabel(order.status)}</p>
          <p className={styles.total}>{formatPrice(order.total_amount)}</p>
          <div className={styles.successActions}>
            <Link to="/profile" className={styles.secondaryBtn}>
              مشاهده سفارش‌ها
            </Link>
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
          <h2 className={styles.sectionTitle}>تأیید سبد خرید</h2>
          <p className={styles.muted}>
            با ثبت سفارش، اقلام سبد به سرور ارسال می‌شود.
          </p>
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
