import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  adminDeleteCategory,
  adminListCategories,
} from '@/services/admin/adminCategoryService'
import { getParentCategoryName } from '@/utils/categoryHelpers'
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

  const sortedCategories = [...categories].sort((left, right) => {
    const leftParent = left.parentId ?? ''
    const rightParent = right.parentId ?? ''
    if (leftParent !== rightParent) {
      if (!leftParent) return -1
      if (!rightParent) return 1
      return leftParent.localeCompare(rightParent)
    }
    return left.name.localeCompare(right.name, 'fa')
  })

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>مدیریت دسته‌بندی‌ها</h1>
          <p className={styles.subtitle}>لیست دسته‌بندی‌ها و زیردسته‌ها</p>
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
                <th>دسته والد</th>
                <th>تاریخ ایجاد</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {sortedCategories.map((category) => (
                <tr key={category.id}>
                  <td>
                    {category.parentId ? `↳ ${category.name}` : category.name}
                  </td>
                  <td>{category.slug}</td>
                  <td>{getParentCategoryName(categories, category.parentId) || '—'}</td>
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
