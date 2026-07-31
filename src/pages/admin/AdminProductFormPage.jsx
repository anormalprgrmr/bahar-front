import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  adminCreateProduct,
  adminUpdateProduct,
  adminUploadProductImage,
} from '@/services/admin/adminProductService'
import { adminListCategories } from '@/services/admin/adminCategoryService'
import { getProductById } from '@/services/products/productService'
import styles from './AdminShared.module.css'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  newPrice: '',
  image: '',
  stock: '0',
  images: '',
  categoryId: '',
  country: '',
  skinType: '',
  famousProducts: '',
  suitableFor: '',
  onSale: false,
}

export function AdminProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [categories, setCategories] = useState(
    /** @type {import('@/types/category').Category[]} */ ([]),
  )
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadFile, setUploadFile] = useState(/** @type {File | null} */ (null))

  useEffect(() => {
    let cancelled = false

    async function loadCategories() {
      try {
        const result = await adminListCategories()
        if (!cancelled) setCategories(result)
      } catch {
        if (!cancelled) setCategories([])
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

    async function loadProduct() {
      setLoading(true)
      setError('')
      try {
        const [product, categoryList] = await Promise.all([
          getProductById(id),
          adminListCategories(),
        ])
        if (cancelled) return
        if (!product) {
          setError('محصول یافت نشد.')
          return
        }

        setCategories(categoryList)
        const matchedCategory = categoryList.find(
          (category) =>
            category.id === product.categoryId || category.slug === product.category,
        )

        setForm({
          name: product.name,
          description: product.description,
          price: String(product.price),
          newPrice: product.newPrice != null ? String(product.newPrice) : '',
          image: product.image,
          stock: String(product.stock ?? 0),
          images: (product.images ?? []).join('\n'),
          categoryId: product.categoryId ?? matchedCategory?.id ?? '',
          country: product.country ?? '',
          skinType: product.skinType ?? '',
          famousProducts: product.famousProducts ?? '',
          suitableFor: product.suitableFor ?? '',
          onSale: Boolean(product.onSale),
        })
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'بارگذاری محصول ناموفق بود.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProduct()
    return () => {
      cancelled = true
    }
  }, [id])

  function buildPayload() {
    const images = form.images
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const image = form.image.trim() || images[0] || ''
    if (!images.length && image) images.push(image)

    const newPriceRaw = form.newPrice.trim()
    const selectedCategory = categories.find((category) => category.id === form.categoryId)

    /** @type {import('@/types/product').ProductUpsertPayload} */
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      newPrice: newPriceRaw === '' ? null : Number(newPriceRaw),
      image,
      stock: Number(form.stock) || 0,
      images,
      onSale: form.onSale,
    }

    if (form.country.trim()) payload.country = form.country.trim()
    if (form.skinType.trim()) payload.skinType = form.skinType.trim()
    if (form.famousProducts.trim()) payload.famousProducts = form.famousProducts.trim()
    if (form.suitableFor.trim()) payload.suitableFor = form.suitableFor.trim()

    if (form.categoryId) {
      payload.categoryId = form.categoryId
    } else if (selectedCategory?.slug) {
      payload.category = selectedCategory.slug
    }

    return payload
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = buildPayload()
      if (!payload.name || !payload.description || !payload.image || !payload.images.length) {
        throw new Error('نام، توضیحات و حداقل یک تصویر الزامی است.')
      }

      if (!payload.categoryId && !payload.category) {
        throw new Error('انتخاب دسته‌بندی الزامی است.')
      }

      if (isEditing && id) {
        await adminUpdateProduct(id, payload)
        if (uploadFile) {
          await adminUploadProductImage(id, uploadFile, true)
        }
      } else {
        const created = await adminCreateProduct(payload)
        if (uploadFile) {
          await adminUploadProductImage(created.id, uploadFile, true)
        }
      }

      navigate('/admin/products', {
        state: { success: isEditing ? 'محصول به‌روزرسانی شد.' : 'محصول ایجاد شد.' },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ذخیره محصول ناموفق بود.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Link to="/admin/products" className={styles.backLink}>
          ← بازگشت به لیست محصولات
        </Link>
        <p className={styles.muted}>در حال بارگذاری...</p>
      </div>
    )
  }

  return (
    <div>
      <Link to="/admin/products" className={styles.backLink}>
        ← بازگشت به لیست محصولات
      </Link>

      <h1 className={styles.title}>{isEditing ? 'ویرایش محصول' : 'ایجاد محصول'}</h1>
      <p className={styles.subtitle}>
        {isEditing ? 'اطلاعات محصول را ویرایش کنید' : 'محصول جدید به فروشگاه اضافه کنید'}
      </p>

      {error && <p className={styles.error}>{error}</p>}

      {categories.length === 0 && (
        <p className={styles.error}>
          ابتدا از{' '}
          <Link to="/admin/categories/new">اینجا</Link> یک دسته‌بندی ایجاد کنید.
        </p>
      )}

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label}>نام</label>
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>دسته‌بندی</label>
            <select
              className={styles.select}
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              required
            >
              <option value="">انتخاب دسته‌بندی</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>توضیحات</label>
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>قیمت</label>
            <input
              className={styles.input}
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>قیمت تخفیف‌خورده (اختیاری)</label>
            <input
              className={styles.input}
              type="number"
              min="0"
              value={form.newPrice}
              onChange={(e) => setForm((f) => ({ ...f, newPrice: e.target.value }))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>موجودی</label>
            <input
              className={styles.input}
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            />
          </div>
          <div className={styles.checkboxRow}>
            <input
              id="on-sale"
              type="checkbox"
              checked={form.onSale}
              onChange={(e) => setForm((f) => ({ ...f, onSale: e.target.checked }))}
            />
            <label htmlFor="on-sale">در تخفیف</label>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>کشور</label>
            <input
              className={styles.input}
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>برای چه پوستیه</label>
            <input
              className={styles.input}
              value={form.skinType}
              onChange={(e) => setForm((f) => ({ ...f, skinType: e.target.value }))}
            />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>معروف‌ترین محصولات</label>
            <textarea
              className={styles.textarea}
              value={form.famousProducts}
              onChange={(e) => setForm((f) => ({ ...f, famousProducts: e.target.value }))}
            />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>مناسب چه افرادیه</label>
            <textarea
              className={styles.textarea}
              value={form.suitableFor}
              onChange={(e) => setForm((f) => ({ ...f, suitableFor: e.target.value }))}
            />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>آدرس تصویر اصلی</label>
            <input
              className={styles.input}
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>گالری تصاویر (هر خط یک آدرس)</label>
            <textarea
              className={styles.textarea}
              value={form.images}
              onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
            />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>
              آپلود تصویر {isEditing ? '(اختیاری، به‌عنوان تصویر اصلی)' : '(پس از ایجاد، اختیاری)'}
            </label>
            <input
              className={styles.input}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <Link to="/admin/products" className={styles.ghostBtn}>
            انصراف
          </Link>
          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={saving || categories.length === 0}
          >
            {saving ? 'در حال ذخیره...' : isEditing ? 'ذخیره تغییرات' : 'ایجاد محصول'}
          </button>
        </div>
      </form>
    </div>
  )
}
