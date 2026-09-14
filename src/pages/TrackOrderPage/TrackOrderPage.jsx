import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { trackOrder } from '@/services/orders/orderService'
import { formatPrice } from '@/utils/formatPrice'
import { getOrderStatusLabel } from '@/utils/productHelpers'
import formStyles from '@/styles/forms.module.css'
import styles from './TrackOrderPage.module.css'

export function TrackOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCode = searchParams.get('code') ?? ''
  const [code, setCode] = useState(initialCode)
  const [order, setOrder] = useState(/** @type {import('@/types/order').Order | null} */ (null))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(Boolean(initialCode))

  useEffect(() => {
    if (!initialCode) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      const result = await trackOrder(initialCode)
      if (!cancelled) {
        if (!result) setError('سفارشی با این کد پیگیری یافت نشد.')
        setOrder(result)
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [initialCode])

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) {
      setError('کد پیگیری را وارد کنید.')
      return
    }
    setSearchParams({ code: trimmed })
    setLoading(true)
    setError('')
    const result = await trackOrder(trimmed)
    if (!result) setError('سفارشی با این کد پیگیری یافت نشد.')
    setOrder(result)
    setLoading(false)
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>پیگیری سفارش</h1>
      <p className={styles.muted}>کد پیگیری دریافتی هنگام ثبت سفارش را وارد کنید.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="tracking-code">
            کد پیگیری
          </label>
          <input
            id="tracking-code"
            className={formStyles.input}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="مثلاً BHR-A1B2C3D4"
            autoComplete="off"
          />
        </div>
        {error && <p className={formStyles.error}>{error}</p>}
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'در حال جستجو...' : 'مشاهده وضعیت'}
        </button>
      </form>

      {order && (
        <section className={styles.result}>
          <h2 className={styles.sectionTitle}>وضعیت سفارش</h2>
          <dl className={styles.meta}>
            <div>
              <dt>کد پیگیری</dt>
              <dd>{order.tracking_code}</dd>
            </div>
            <div>
              <dt>وضعیت</dt>
              <dd>{getOrderStatusLabel(order.status)}</dd>
            </div>
            <div>
              <dt>مبلغ</dt>
              <dd>{formatPrice(order.total_amount)}</dd>
            </div>
            <div>
              <dt>تاریخ</dt>
              <dd>{new Date(order.created_at).toLocaleDateString('fa-IR')}</dd>
            </div>
            {order.guest_name && (
              <div>
                <dt>گیرنده</dt>
                <dd>{order.guest_name}</dd>
              </div>
            )}
          </dl>
          {order.status === 'pending' && (
            <Link
              to={`/checkout/${order.id}?tracking=${encodeURIComponent(order.tracking_code)}`}
              className={styles.payLink}
            >
              ادامه پرداخت
            </Link>
          )}
        </section>
      )}
    </div>
  )
}
