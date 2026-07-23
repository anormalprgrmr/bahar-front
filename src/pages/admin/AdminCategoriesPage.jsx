import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  adminDeleteCategory,
  adminListCategories,
} from '@/services/admin/adminCategoryService'
import styles from './AdminShared.module.css'

export function AdminCategoriesPage() {
  const location = useLocation()
  const [categories, setCategories] = useState(
    /** @type {import('@/types/category').Category[]} */ ([]),
  )
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

  async function load() {
    setLoading(true)
    setError('')
    try {
      const result = await adminListCategories()
      setCategories(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'بارگذاری دسته‌بندی‌ها ناموفق بود.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(id) {
    if (!window.confirm('این دسته‌بندی حذف شود؟')) return
    setError('')
    setSuccess('')
    try {
      await adminDeleteCategory(id)
      setSuccess('دسته‌بندی حذف شد.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حذف دسته‌بندی ناموفق بود.')
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>مدیریت دسته‌بندی‌ها</h1>
          <p className={styles.subtitle}>لیست دسته‌بندی‌های محصولات</p>
        </div>
        <Link to="/admin/categories/new" className={styles.primaryBtn}>
          ایجاد دسته‌بندی
        </Link>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <div className={styles.tableWrap}>
        {loading ? (
          <p className={styles.muted} style={{ padding: '1rem' }}>
            در حال بارگذاری...
          </p>
        ) : categories.length === 0 ? (
          <p className={styles.muted} style={{ padding: '1rem' }}>
            دسته‌بندی‌ای وجود ندارد.
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>نام</th>
                <th>اسلاگ</th>
                <th>تاریخ ایجاد</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>
                    {category.created_at
                      ? new Date(category.created_at).toLocaleDateString('fa-IR')
                      : '—'}
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link
                        to={`/admin/categories/${category.id}/edit`}
                        className={styles.ghostBtn}
                      >
                        ویرایش
                      </Link>
                      <button
                        type="button"
                        className={styles.dangerBtn}
                        onClick={() => handleDelete(category.id)}
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
    </div>
  )
}
