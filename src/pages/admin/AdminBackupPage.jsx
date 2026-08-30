import { useState } from 'react'
import { adminDownloadBackup, adminImportBackup } from '@/services/admin/adminBackupService'
import styles from './AdminShared.module.css'

export function AdminBackupPage() {
  const [downloading, setDownloading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [backupFile, setBackupFile] = useState(/** @type {File | null} */ (null))
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleDownload() {
    setDownloading(true)
    setError('')
    setSuccess('')

    try {
      await adminDownloadBackup()
      setSuccess('فایل پشتیبان با موفقیت دانلود شد.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'دانلود پشتیبان ناموفق بود.')
    } finally {
      setDownloading(false)
    }
  }

  async function handleImport(event) {
    event.preventDefault()
    if (!backupFile) {
      setError('لطفاً فایل پشتیبان را انتخاب کنید.')
      return
    }
    if (!confirmed) {
      setError('برای بازیابی، تأیید را علامت بزنید.')
      return
    }

    setImporting(true)
    setError('')
    setSuccess('')

    try {
      await adminImportBackup(backupFile)
      setSuccess('پشتیبان با موفقیت بازیابی شد.')
      setBackupFile(null)
      setConfirmed(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'بازیابی پشتیبان ناموفق بود.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div>
      <h1 className={styles.title}>پشتیبان‌گیری</h1>
      <p className={styles.subtitle}>
        دانلود نسخه پشتیبان کامل فروشگاه یا بازیابی از فایل قبلی
      </p>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <div className={styles.formCard}>
        <h2 className={styles.sectionTitle}>دانلود پشتیبان</h2>
        <p className={styles.hint}>
          شامل کاربران، دسته‌بندی‌ها، محصولات، سفارش‌ها و تصاویر آپلودشده است.
        </p>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={handleDownload}
          disabled={downloading || importing}
        >
          {downloading ? 'در حال آماده‌سازی...' : 'دانلود فایل پشتیبان'}
        </button>
      </div>

      <form className={styles.formCard} onSubmit={handleImport}>
        <h2 className={styles.sectionTitle}>بازیابی از پشتیبان</h2>
        <p className={styles.hint}>
          با بازیابی، تمام داده‌های فعلی جایگزین می‌شوند. این عمل قابل بازگشت نیست.
        </p>

        <div className={styles.field}>
          <label className={styles.label}>فایل پشتیبان (.tar.gz)</label>
          <input
            className={styles.input}
            type="file"
            accept=".tar.gz,.tgz,application/gzip,application/x-gzip"
            onChange={(event) => setBackupFile(event.target.files?.[0] ?? null)}
          />
        </div>

        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
          />
          <span>می‌دانم که داده‌های فعلی حذف و با محتوای این فایل جایگزین می‌شوند.</span>
        </label>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.dangerBtn}
            disabled={importing || downloading || !backupFile || !confirmed}
          >
            {importing ? 'در حال بازیابی...' : 'بازیابی پشتیبان'}
          </button>
        </div>
      </form>
    </div>
  )
}
