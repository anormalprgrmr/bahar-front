import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  adminDeleteSliderImage,
  adminUploadSliderImage,
  listSliderImages,
} from '@/services/homeSlider/homeSliderService'
import styles from './AdminShared.module.css'
import localStyles from './AdminSliderPage.module.css'

export function AdminSliderPage() {
  const [images, setImages] = useState(
    /** @type {{ id: string, imageUrl: string }[]} */ ([]),
  )
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const result = await listSliderImages()
      setImages(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'بارگذاری اسلایدر ناموفق بود.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleUpload(event) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (files.length === 0) return

    setUploading(true)
    setError('')
    setSuccess('')
    try {
      for (const file of files) {
        await adminUploadSliderImage(file)
      }
      setSuccess('تصویر(ها) اضافه شد.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'آپلود تصویر ناموفق بود.')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('این تصویر از اسلایدر حذف شود؟')) return
    setError('')
    setSuccess('')
    try {
      await adminDeleteSliderImage(id)
      setSuccess('تصویر حذف شد.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حذف تصویر ناموفق بود.')
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>اسلایدر صفحه اصلی</h1>
          <p className={styles.subtitle}>تصاویر بنر بالای صفحه اصلی را مدیریت کنید</p>
        </div>
        <label className={styles.primaryBtn}>
          {uploading ? 'در حال آپلود...' : 'افزودن تصویر'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className={localStyles.hiddenInput}
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      {loading ? (
        <p className={styles.muted}>در حال بارگذاری...</p>
      ) : images.length === 0 ? (
        <p className={styles.muted}>هنوز تصویری برای اسلایدر اضافه نشده است.</p>
      ) : (
        <div className={localStyles.grid}>
          {images.map((image) => (
            <div key={image.id} className={localStyles.card}>
              <img src={image.imageUrl} alt="" className={localStyles.image} />
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={() => handleDelete(image.id)}
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}

      <p className={styles.muted} style={{ marginTop: '1rem' }}>
        <Link to="/">مشاهده صفحه اصلی</Link>
      </p>
    </div>
  )
}
