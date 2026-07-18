import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import formStyles from '@/styles/forms.module.css'
import styles from '../auth/AuthPage.module.css'

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from ?? '/'

  const [email, setEmail] = useState('')
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
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ورود ناموفق بود.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.card}>
        <h1 className={styles.title}>ورود</h1>
        <p className={styles.subtitle}>به حساب کاربری بهار خوش آمدید</p>

        <form className={formStyles.form} onSubmit={handleSubmit}>
          {error && <p className={formStyles.error}>{error}</p>}

          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="login-email">
              ایمیل
            </label>
            <input
              id="login-email"
              type="email"
              className={formStyles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="login-password">
              رمز عبور
            </label>
            <input
              id="login-password"
              type="password"
              className={formStyles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className={formStyles.submit} disabled={submitting}>
            {submitting ? 'در حال ورود...' : 'ورود'}
          </button>

          <p className={formStyles.hint}>
            حساب کاربری ندارید؟{' '}
            <Link to="/register" state={{ from }}>
              ثبت‌نام کنید
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
