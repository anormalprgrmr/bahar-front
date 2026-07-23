import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { adminListUsers, adminUpdateUser } from '@/services/admin/adminUserService'
import formStyles from '@/styles/forms.module.css'
import styles from './AdminShared.module.css'

export function AdminUserEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return

    const userFromState = location.state?.user
    if (userFromState?.id === id) {
      setName(userFromState.name ?? '')
      setEmail(userFromState.email ?? '')
      setPhone(userFromState.phone ?? '')
      setAddress(userFromState.address ?? '')
      setIsAdmin(Boolean(userFromState.is_admin))
      setLoading(false)
      return
    }

    let cancelled = false

    async function loadUser() {
      setLoading(true)
      setError('')
      try {
        const result = await adminListUsers({ page: 1, pageSize: 100 })
        const user = result?.data?.find((item) => item.id === id)
        if (cancelled) return
        if (!user) {
          setError('کاربر یافت نشد.')
          return
        }
        setName(user.name ?? '')
        setEmail(user.email ?? '')
        setPhone(user.phone ?? '')
        setAddress(user.address ?? '')
        setIsAdmin(Boolean(user.is_admin))
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'بارگذاری کاربر ناموفق بود.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadUser()
    return () => {
      cancelled = true
    }
  }, [id, location.state])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!id) return

    setSubmitting(true)
    setError('')

    try {
      await adminUpdateUser(id, {
        name,
        email,
        phone,
        address,
        is_admin: isAdmin,
        password: password || undefined,
      })
      navigate('/admin/users', { state: { success: 'اطلاعات کاربر به‌روزرسانی شد.' } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'به‌روزرسانی کاربر ناموفق بود.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Link to="/admin/users" className={styles.backLink}>
          ← بازگشت به لیست کاربران
        </Link>
        <p className={styles.muted}>در حال بارگذاری...</p>
      </div>
    )
  }

  return (
    <div>
      <Link to="/admin/users" className={styles.backLink}>
        ← بازگشت به لیست کاربران
      </Link>

      <h1 className={styles.title}>ویرایش کاربر</h1>
      <p className={styles.subtitle}>اطلاعات کاربر را ویرایش کنید</p>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={formStyles.form}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="edit-user-name">
              نام
            </label>
            <input
              id="edit-user-name"
              className={formStyles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="edit-user-address">
              آدرس
            </label>
            <textarea
              id="edit-user-address"
              className={formStyles.textarea}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <Link to="/admin/users" className={styles.ghostBtn}>
            انصراف
          </Link>
          <button type="submit" className={styles.primaryBtn} disabled={submitting}>
            {submitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
        </div>
      </form>
    </div>
  )
}
