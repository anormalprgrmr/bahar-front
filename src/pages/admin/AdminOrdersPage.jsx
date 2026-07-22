import { useEffect, useState } from 'react'
import {
  adminDeleteOrder,
  adminListOrders,
  adminUpdateOrderStatus,
} from '@/services/admin/adminOrderService'
import { formatPrice } from '@/utils/formatPrice'
import { getOrderStatusLabel } from '@/utils/productHelpers'
import styles from './AdminShared.module.css'

const STATUS_OPTIONS = [
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

export function AdminOrdersPage() {
  const [orders, setOrders] = useState(/** @type {import('@/types/order').Order[]} */ ([]))
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function load(nextPage = page) {
    setLoading(true)
    setError('')
    try {
      const result = await adminListOrders({ page: nextPage, pageSize: 10 })
      setOrders(result?.data ?? [])
      setTotalPages(result?.pagination?.total_pages || 1)
      setPage(result?.pagination?.page || nextPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'بارگذاری سفارش‌ها ناموفق بود.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(1)
  }, [])

  /**
   * @param {string} orderId
   * @param {import('@/types/order').OrderStatus} status
   */
  async function handleStatusChange(orderId, status) {
    setError('')
    setSuccess('')
    try {
      await adminUpdateOrderStatus(orderId, status)
      setSuccess('وضعیت سفارش به‌روزرسانی شد.')
      await load(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'به‌روزرسانی وضعیت ناموفق بود.')
    }
  }

  async function handleDelete(orderId) {
    if (!window.confirm('این سفارش حذف شود؟')) return
    setError('')
    setSuccess('')
    try {
      await adminDeleteOrder(orderId)
      setSuccess('سفارش حذف شد.')
      await load(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حذف سفارش ناموفق بود.')
    }
  }

  return (
    <div>
      <h1 className={styles.title}>مدیریت سفارش‌ها</h1>
      <p className={styles.subtitle}>مشاهده، تغییر وضعیت و حذف سفارش‌ها</p>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <div className={styles.tableWrap}>
        {loading ? (
          <p className={styles.muted} style={{ padding: '1rem' }}>
            در حال بارگذاری...
          </p>
        ) : orders.length === 0 ? (
          <p className={styles.muted} style={{ padding: '1rem' }}>
            سفارشی وجود ندارد.
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>شناسه</th>
                <th>کاربر</th>
                <th>مبلغ</th>
                <th>تاریخ</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 8)}</td>
                  <td>{order.user?.name || order.user?.email || order.user_id.slice(0, 8)}</td>
                  <td>{formatPrice(order.total_amount)}</td>
                  <td>{new Date(order.created_at).toLocaleDateString('fa-IR')}</td>
                  <td>
                    <select
                      className={styles.select}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          /** @type {import('@/types/order').OrderStatus} */ (
                            e.target.value
                          ),
                        )
                      }
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {getOrderStatusLabel(
                            /** @type {import('@/types/order').OrderStatus} */ (status),
                          )}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.dangerBtn}
                      onClick={() => handleDelete(order.id)}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.pagination}>
        <button
          type="button"
          className={styles.ghostBtn}
          disabled={page <= 1}
          onClick={() => load(page - 1)}
        >
          قبلی
        </button>
        <span className={styles.muted}>
          صفحه {new Intl.NumberFormat('fa-IR').format(page)} از{' '}
          {new Intl.NumberFormat('fa-IR').format(totalPages)}
        </span>
        <button
          type="button"
          className={styles.ghostBtn}
          disabled={page >= totalPages}
          onClick={() => load(page + 1)}
        >
          بعدی
        </button>
      </div>
    </div>
  )
}
