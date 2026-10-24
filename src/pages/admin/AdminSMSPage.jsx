import { useEffect, useState } from 'react'
import { adminGetSMSRecipients, adminSendSMSBroadcast } from '@/services/admin/adminSMSService'
import styles from './AdminShared.module.css'

export function AdminSMSPage() {
  const [message, setMessage] = useState('')
  const [recipientCount, setRecipientCount] = useState(0)
  const [configured, setConfigured] = useState(false)
  const [loadingRecipients, setLoadingRecipients] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadRecipients() {
    setLoadingRecipients(true)
    setError('')
    try {
      const result = await adminGetSMSRecipients()
      setRecipientCount(result?.recipient_count ?? 0)
      setConfigured(Boolean(result?.configured))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'دریافت تعداد مخاطبان ناموفق بود.')
    } finally {
      setLoadingRecipients(false)
    }
  }

  useEffect(() => {
    loadRecipients()
  }, [])

  async function handleSend(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (!message.trim() || recipientCount < 1) return

    const confirmed = window.confirm(
      `این پیامک برای ${new Intl.NumberFormat('fa-IR').format(recipientCount)} شماره معتبر ارسال شود؟ ارسال پیامک هزینه دارد و پس از ارسال قابل لغو نیست.`,
    )
    if (!confirmed) return

    setSending(true)
    try {
      const result = await adminSendSMSBroadcast(message.trim())
      setSuccess(
        `ارسال پایان یافت؛ موفق: ${new Intl.NumberFormat('fa-IR').format(result?.sent ?? 0)}، ناموفق: ${new Intl.NumberFormat('fa-IR').format(result?.failed ?? 0)} از ${new Intl.NumberFormat('fa-IR').format(result?.recipients ?? recipientCount)} شماره.`,
      )
      setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ارسال پیامک ناموفق بود.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <h1 className={styles.title}>ارسال پیامک همگانی</h1>
      <p className={styles.subtitle}>ارسال یک پیام به کاربران ثبت‌نام‌شده‌ای که شماره موبایل معتبر دارند.</p>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <section className={styles.formCard}>
        <div className={styles.smsSummary}>
          <strong>تعداد گیرندگان:</strong>{' '}
          {loadingRecipients
            ? 'در حال محاسبه...'
            : new Intl.NumberFormat('fa-IR').format(recipientCount)}
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={loadRecipients}
            disabled={loadingRecipients || sending}
          >
            به‌روزرسانی
          </button>
        </div>

        {!configured && (
          <p className={styles.error}>
            سرویس پیامک پیکربندی نشده است. مدیر سرور باید AMOOTSMS_TOKEN و AMOOTSMS_LINE_NUMBER را در فایل محیطی تنظیم و API را دوباره راه‌اندازی کند.
          </p>
        )}
        <p className={styles.hint}>
          فقط شماره‌های معتبر کاربران عادی دریافت‌کننده‌اند؛ شماره‌های تکراری و حساب‌های مدیر حذف می‌شوند. ارسال پیامک ممکن است هزینه داشته باشد.
        </p>

        <form onSubmit={handleSend}>
          <label className={styles.field}>
            <span className={styles.label}>متن پیام (حداکثر ۵۰۰ نویسه)</span>
            <textarea
              className={styles.textarea}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={500}
              rows={7}
              required
              placeholder="متن پیامک را بنویسید..."
            />
          </label>
          <p className={styles.hint}>
            {new Intl.NumberFormat('fa-IR').format(message.length)} / ۵۰۰
          </p>
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={!configured || loadingRecipients || recipientCount < 1 || sending || !message.trim()}
            >
              {sending ? 'در حال ارسال...' : 'ارسال به همه کاربران'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
