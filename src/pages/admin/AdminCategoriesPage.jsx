import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  adminDeleteCategory,
  adminListCategories,
  adminReorderCategories,
} from '@/services/admin/adminCategoryService'
import {
  buildAdminCategoryRows,
  getParentCategoryName,
  getSubcategories,
  getTopLevelCategories,
} from '@/utils/categoryHelpers'
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
  const [reorderingId, setReorderingId] = useState('')

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

  /**
   * @param {string} categoryId
   * @param {string | null} parentId
   * @param {-1 | 1} direction
   */
  async function handleMove(categoryId, parentId, direction) {
    const siblings = parentId
      ? getSubcategories(categories, parentId)
      : getTopLevelCategories(categories)
    const currentIndex = siblings.findIndex((category) => category.id === categoryId)
    const targetIndex = currentIndex + direction

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= siblings.length) {
      return
    }

    const nextOrder = [...siblings]
    const [moved] = nextOrder.splice(currentIndex, 1)
    nextOrder.splice(targetIndex, 0, moved)

    setError('')
    setSuccess('')
    setReorderingId(categoryId)

    try {
      await adminReorderCategories(parentId, nextOrder.map((category) => category.id))
      setSuccess('ترتیب دسته‌بندی به‌روزرسانی شد.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تغییر ترتیب ناموفق بود.')
    } finally {
      setReorderingId('')
    }
  }

  const categoryRows = buildAdminCategoryRows(categories)

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>مدیریت دسته‌بندی‌ها</h1>
          <p className={styles.subtitle}>
            لیست دسته‌بندی‌ها، تغییر ترتیب نمایش و ویرایش
          </p>
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
                <th>ترتیب</th>
                <th>تاریخ ایجاد</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {categoryRows.map(({ category, parentId, level }) => {
                const siblings = parentId
                  ? getSubcategories(categories, parentId)
                  : getTopLevelCategories(categories)
                const siblingIndex = siblings.findIndex(
                  (item) => item.id === category.id,
                )
                const isFirst = siblingIndex <= 0
                const isLast = siblingIndex >= siblings.length - 1
                const isMoving = reorderingId === category.id

                return (
                  <tr key={category.id}>
                    <td style={{ paddingRight: level > 0 ? '1.5rem' : undefined }}>
                      {level > 0 ? `↳ ${category.name}` : category.name}
                    </td>
                    <td>{category.slug}</td>
                    <td>
                      {getParentCategoryName(categories, category.parentId) || '—'}
                    </td>
                    <td>
                      <div className={styles.orderActions}>
                        <button
                          type="button"
                          className={styles.orderBtn}
                          disabled={isFirst || isMoving}
                          onClick={() => handleMove(category.id, parentId, -1)}
                          aria-label={`انتقال ${category.name} به بالا`}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className={styles.orderBtn}
                          disabled={isLast || isMoving}
                          onClick={() => handleMove(category.id, parentId, 1)}
                          aria-label={`انتقال ${category.name} به پایین`}
                        >
                          ↓
                        </button>
                      </div>
                    </td>
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
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
