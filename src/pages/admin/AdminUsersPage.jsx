import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { adminDeleteUser, adminListUsers } from '@/services/admin/adminUserService'
import styles from './AdminShared.module.css'

export function AdminUsersPage() {
  const location = useLocation()
  const [users, setUsers] = useState(/** @type {import('@/types/user').AdminUser[]} */ ([]))
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(
    /** @type {string} */ (location.state?.success ?? ''),
  )

  useEffect(() => {
    if (location.state?.success) {
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  async function load(nextPage = page) {
    setLoading(true)
    setError('')
    try {
      const result = await adminListUsers({ page: nextPage, pageSize: 10 })
      setUsers(result?.data ?? [])
      setTotalPages(result?.pagination?.total_pages || 1)
      setPage(result?.pagination?.page || nextPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'بارگذاری کاربران ناموفق بود.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(1)
  }, [])

  async function handleDelete(userId) {
    if (!window.confirm('این کاربر حذف شود؟')) return
    setError('')
    setSuccess('')
    try {
      await adminDeleteUser(userId)
      setSuccess('کاربر حذف شد.')
      await load(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حذف کاربر ناموفق بود.')
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>مدیریت کاربران</h1>
          <p className={styles.subtitle}>لیست کاربران فروشگاه</p>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <div className={styles.tableWrap}>
        {loading ? (
          <p className={styles.muted} style={{ padding: '1rem' }}>
            در حال بارگذاری...
          </p>
        ) : users.length === 0 ? (
          <p className={styles.muted} style={{ padding: '1rem' }}>
            کاربری وجود ندارد.
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>نام</th>
                <th>ایمیل</th>
                <th>تلفن</th>
                <th>نقش</th>
                <th>تاریخ عضویت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name || '—'}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || '—'}</td>
                  <td>{user.is_admin ? 'مدیر' : 'کاربر'}</td>
                  <td>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString('fa-IR')
                      : '—'}
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link
                        to={`/admin/users/${user.id}/edit`}
                        state={{ user }}
                        className={styles.ghostBtn}
                      >
                        ویرایش
                      </Link>
                      <button
                        type="button"
                        className={styles.dangerBtn}
                        onClick={() => handleDelete(user.id)}
                      >
                        حذف
                      </button>
                    </div>
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
