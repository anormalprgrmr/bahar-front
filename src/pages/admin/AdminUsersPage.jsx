import { useEffect, useState } from 'react'
import {
  adminDeleteUser,
  adminListUsers,
  adminUpdateUser,
} from '@/services/admin/adminUserService'
import formStyles from '@/styles/forms.module.css'
import styles from './AdminShared.module.css'

export function AdminUsersPage() {
  const [users, setUsers] = useState(/** @type {import('@/types/user').AdminUser[]} */ ([]))
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [editingUser, setEditingUser] = useState(
    /** @type {import('@/types/user').AdminUser | null} */ (null),
  )
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editIsAdmin, setEditIsAdmin] = useState(false)
  const [editPassword, setEditPassword] = useState('')
  const [editSubmitting, setEditSubmitting] = useState(false)

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

  /**
   * @param {import('@/types/user').AdminUser} user
   */
  function openEdit(user) {
    setEditingUser(user)
    setEditName(user.name ?? '')
    setEditEmail(user.email ?? '')
    setEditPhone(user.phone ?? '')
    setEditAddress(user.address ?? '')
    setEditIsAdmin(Boolean(user.is_admin))
    setEditPassword('')
    setError('')
    setSuccess('')
  }

  function closeEdit() {
    setEditingUser(null)
    setEditPassword('')
  }

  async function handleEditSubmit(event) {
    event.preventDefault()
    if (!editingUser) return

    setEditSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await adminUpdateUser(editingUser.id, {
        name: editName,
        email: editEmail,
        phone: editPhone,
        address: editAddress,
        is_admin: editIsAdmin,
        password: editPassword || undefined,
      })
      setSuccess('اطلاعات کاربر به‌روزرسانی شد.')
      closeEdit()
      await load(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'به‌روزرسانی کاربر ناموفق بود.')
    } finally {
      setEditSubmitting(false)
    }
  }

  async function handleDelete(userId) {
    if (!window.confirm('این کاربر حذف شود؟')) return
    setError('')
    setSuccess('')
    try {
      await adminDeleteUser(userId)
      setSuccess('کاربر حذف شد.')
      if (editingUser?.id === userId) closeEdit()
      await load(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حذف کاربر ناموفق بود.')
    }
  }

  return (
    <div>
      <h1 className={styles.title}>مدیریت کاربران</h1>
      <p className={styles.subtitle}>مشاهده، ویرایش و حذف کاربران</p>

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
                      <button
                        type="button"
                        className={styles.ghostBtn}
                        onClick={() => openEdit(user)}
                      >
                        ویرایش
                      </button>
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

      {editingUser && (
        <div className={styles.modalBackdrop} onClick={closeEdit}>
          <div
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-labelledby="edit-user-title"
          >
            <h2 id="edit-user-title" className={styles.modalTitle}>
              ویرایش کاربر
            </h2>
            <form className={formStyles.form} onSubmit={handleEditSubmit}>
              <div className={formStyles.field}>
                <label className={formStyles.label} htmlFor="edit-user-name">
                  نام
                </label>
                <input
                  id="edit-user-name"
                  className={formStyles.input}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className={formStyles.field}>
                <label className={formStyles.label} htmlFor="edit-user-email">
                  ایمیل
                </label>
                <input
                  id="edit-user-email"
                  type="email"
                  className={formStyles.input}
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>

              <div className={formStyles.field}>
                <label className={formStyles.label} htmlFor="edit-user-phone">
                  تلفن
                </label>
                <input
                  id="edit-user-phone"
                  type="tel"
                  className={formStyles.input}
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </div>

              <div className={formStyles.field}>
                <label className={formStyles.label} htmlFor="edit-user-address">
                  آدرس
                </label>
                <textarea
                  id="edit-user-address"
                  className={formStyles.textarea}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                />
              </div>

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={editIsAdmin}
                  onChange={(e) => setEditIsAdmin(e.target.checked)}
                />
                دسترسی مدیر
              </label>

              <div className={formStyles.field}>
                <label className={formStyles.label} htmlFor="edit-user-password">
                  رمز عبور جدید (اختیاری)
                </label>
                <input
                  id="edit-user-password"
                  type="password"
                  className={formStyles.input}
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  minLength={6}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.ghostBtn}
                  onClick={closeEdit}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={formStyles.submit}
                  disabled={editSubmitting}
                >
                  {editSubmitting ? 'در حال ذخیره...' : 'ذخیره'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
