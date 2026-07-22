import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import formStyles from '@/styles/forms.module.css'
import styles from '../auth/AuthPage.module.css'

export function RegisterPage() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from ?? '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await register({ name, email, phone, address, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ثبت‌نام ناموفق بود.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.card}>
        <h1 className={styles.title}>ثبت‌نام</h1>
        <p className={styles.subtitle}>حساب کاربری جدید بسازید</p>

        <form className={formStyles.form} onSubmit={handleSubmit}>
          {error && <p className={formStyles.error}>{error}</p>}

          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="register-name">
              نام و نام خانوادگی
            </label>
            <input
              id="register-name"
              type="text"
              className={formStyles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="register-email">
              ایمیل
            </label>
            <input
              id="register-email"
              type="email"
              className={formStyles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="register-phone">
              شماره موبایل
            </label>
            <input
              id="register-phone"
              type="tel"
              className={formStyles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              placeholder="۰۹۱۲۱۲۳۴۵۶۷"
            />
          </div>

          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="register-address">
              آدرس
            </label>
            <textarea
              id="register-address"
              className={formStyles.textarea}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="street-address"
            />
          </div>

          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="register-password">
              رمز عبور
            </label>
            <input
              id="register-password"
              type="password"
              className={formStyles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <button type="submit" className={formStyles.submit} disabled={submitting}>
            {submitting ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
          </button>

          <p className={formStyles.hint}>
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <Link to="/login" state={{ from }}>
              وارد شوید
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
