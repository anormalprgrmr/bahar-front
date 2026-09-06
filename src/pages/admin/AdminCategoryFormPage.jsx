import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  adminCreateCategory,
  adminGetCategoryById,
  adminListCategories,
  adminUpdateCategory,
} from '@/services/admin/adminCategoryService'
import { getTopLevelCategories } from '@/utils/categoryHelpers'
import styles from './AdminShared.module.css'

const emptyForm = {
  name: '',
  slug: '',
  parentId: '',
  showInNav: false,
}

export function AdminCategoryFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [allCategories, setAllCategories] = useState(
    /** @type {import('@/types/category').Category[]} */ ([]),
  )
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadCategories() {
      try {
        const result = await adminListCategories()
        if (!cancelled) setAllCategories(result)
      } catch {
        if (!cancelled) setAllCategories([])
      }
    }

    loadCategories()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function loadCategory() {
      setLoading(true)
      setError('')
      try {
        const category = await adminGetCategoryById(id)
        if (cancelled) return
        if (!category) {
          setError('دسته‌بندی یافت نشد.')
          return
        }
        setForm({
          name: category.name,
          slug: category.slug,
          parentId: category.parentId ?? '',
          showInNav: Boolean(category.showInNav),
        })
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'بارگذاری دسته‌بندی ناموفق بود.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadCategory()
    return () => {
      cancelled = true
    }
  }, [id])

  const parentOptions = getTopLevelCategories(allCategories).filter(
    (category) => category.id !== id,
  )

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        parentId: form.parentId || undefined,
        showInNav: form.showInNav,
      }

      if (!payload.name) {
        throw new Error('نام دسته‌بندی الزامی است.')
      }

      if (isEditing && id) {
        await adminUpdateCategory(id, payload)
      } else {
        await adminCreateCategory(payload)
      }

      navigate('/admin/categories', {
        state: {
          success: isEditing ? 'دسته‌بندی به‌روزرسانی شد.' : 'دسته‌بندی ایجاد شد.',
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ذخیره دسته‌بندی ناموفق بود.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Link to="/admin/categories" className={styles.backLink}>
          ← بازگشت به لیست دسته‌بندی‌ها
        </Link>
        <p className={styles.muted}>در حال بارگذاری...</p>
      </div>
    )
  }

  return (
    <div>
      <Link to="/admin/categories" className={styles.backLink}>
        ← بازگشت به لیست دسته‌بندی‌ها
      </Link>

      <h1 className={styles.title}>
        {isEditing ? 'ویرایش دسته‌بندی' : 'ایجاد دسته‌بندی'}
      </h1>
      <p className={styles.subtitle}>
        {isEditing
          ? 'اطلاعات دسته‌بندی را ویرایش کنید'
          : 'دسته‌بندی جدید برای محصولات اضافه کنید'}
      </p>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="category-name">
              نام
            </label>
            <input
              id="category-name"
              className={styles.input}
              value={form.name}
              onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="category-slug">
              اسلاگ (اختیاری)
            </label>
            <input
              id="category-slug"
              className={styles.input}
              value={form.slug}
              onChange={(e) => setForm((current) => ({ ...current, slug: e.target.value }))}
              placeholder="مثلاً skincare"
              dir="ltr"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="category-parent">
              دسته والد (اختیاری)
            </label>
            <select
              id="category-parent"
              className={styles.select}
              value={form.parentId}
              onChange={(e) => setForm((current) => ({ ...current, parentId: e.target.value }))}
            >
              <option value="">بدون والد (دسته اصلی)</option>
              {parentOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.checkboxRow}>
              <input
                id="show-in-nav"
                type="checkbox"
                checked={form.showInNav}
                onChange={(e) =>
                  setForm((current) => ({ ...current, showInNav: e.target.checked }))
                }
              />
              <span>نمایش در منوی اصلی سایت</span>
            </label>
          </div>
        </div>

        <p className={styles.muted}>
          اگر اسلاگ را خالی بگذارید، از روی نام به‌صورت خودکار ساخته می‌شود. زیردسته‌ها فقط می‌توانند
          زیر دسته‌های اصلی قرار بگیرند.
        </p>

        <div className={styles.formActions}>
          <Link to="/admin/categories" className={styles.ghostBtn}>
            انصراف
          </Link>
          <button type="submit" className={styles.primaryBtn} disabled={saving}>
            {saving ? 'در حال ذخیره...' : isEditing ? 'ذخیره تغییرات' : 'ایجاد دسته‌بندی'}
          </button>
        </div>
      </form>
    </div>
  )
}
