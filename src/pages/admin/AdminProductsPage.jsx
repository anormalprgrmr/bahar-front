import { useEffect, useState } from 'react'
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminListProducts,
  adminUpdateProduct,
  adminUploadProductImage,
} from '@/services/admin/adminProductService'
import { formatPrice } from '@/utils/formatPrice'
import { getSalePrice } from '@/utils/productHelpers'
import styles from './AdminShared.module.css'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  newPrice: '',
  image: '',
  stock: '0',
  images: '',
  category: 'skincare',
  onSale: false,
}

export function AdminProductsPage() {
  const [products, setProducts] = useState(/** @type {import('@/types/product').Product[]} */ ([]))
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState(/** @type {string | null} */ (null))
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploadFile, setUploadFile] = useState(/** @type {File | null} */ (null))

  async function load(nextPage = page, q = query) {
    setLoading(true)
    setError('')
    try {
      const result = await adminListProducts({
        page: nextPage,
        pageSize: 10,
        q: q || undefined,
      })
      setProducts(result.data)
      setTotalPages(result.pagination?.total_pages || 1)
      setPage(result.pagination?.page || nextPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'بارگذاری محصولات ناموفق بود.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(1, '')
  }, [])

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setUploadFile(null)
    setSuccess('')
    setError('')
  }

  /**
   * @param {import('@/types/product').Product} product
   */
  function startEdit(product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      newPrice: product.newPrice != null ? String(product.newPrice) : '',
      image: product.image,
      stock: String(product.stock ?? 0),
      images: (product.images ?? []).join('\n'),
      category: product.category || 'skincare',
      onSale: Boolean(product.onSale),
    })
    setUploadFile(null)
    setSuccess('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function buildPayload() {
    const images = form.images
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const image = form.image.trim() || images[0] || ''
    if (!images.length && image) images.push(image)

    const newPriceRaw = form.newPrice.trim()
    return {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      newPrice: newPriceRaw === '' ? null : Number(newPriceRaw),
      image,
      stock: Number(form.stock) || 0,
      images,
      category: form.category.trim(),
      onSale: form.onSale,
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const payload = buildPayload()
      if (!payload.name || !payload.description || !payload.image || !payload.images.length) {
        throw new Error('نام، توضیحات و حداقل یک تصویر الزامی است.')
      }

      if (editingId) {
        await adminUpdateProduct(editingId, payload)
        if (uploadFile) {
          await adminUploadProductImage(editingId, uploadFile, true)
        }
        setSuccess('محصول به‌روزرسانی شد.')
      } else {
        const created = await adminCreateProduct(payload)
        if (uploadFile) {
          await adminUploadProductImage(created.id, uploadFile, true)
        }
        setSuccess('محصول ایجاد شد.')
        setEditingId(null)
        setForm(emptyForm)
        setUploadFile(null)
      }

      await load(page, query)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ذخیره محصول ناموفق بود.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('این محصول حذف شود؟')) return
    setError('')
    try {
      await adminDeleteProduct(id)
      setSuccess('محصول حذف شد.')
      if (editingId === id) startCreate()
      await load(page, query)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حذف محصول ناموفق بود.')
    }
  }

  return (
    <div>
      <h1 className={styles.title}>مدیریت محصولات</h1>
      <p className={styles.subtitle}>ایجاد، ویرایش و حذف محصولات فروشگاه</p>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.toolbar}>
          <h2>{editingId ? 'ویرایش محصول' : 'محصول جدید'}</h2>
          {editingId && (
            <button type="button" className={styles.ghostBtn} onClick={startCreate}>
              انصراف از ویرایش
            </button>
          )}
        </div>

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
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              <option value="skincare">مراقبت پوست</option>
              <option value="makeup">آرایشی</option>
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
              آپلود تصویر {editingId ? '(اختیاری، به‌عنوان تصویر اصلی)' : '(پس از ایجاد، اختیاری)'}
            </label>
            <input
              className={styles.input}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <div className={styles.toolbar} style={{ marginTop: '1rem', marginBottom: 0 }}>
          <button type="submit" className={styles.primaryBtn} disabled={saving}>
            {saving ? 'در حال ذخیره...' : editingId ? 'ذخیره تغییرات' : 'ایجاد محصول'}
          </button>
        </div>
      </form>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="جستجو..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') load(1, query)
          }}
        />
        <button type="button" className={styles.ghostBtn} onClick={() => load(1, query)}>
          جستجو
        </button>
      </div>

      <div className={styles.tableWrap}>
        {loading ? (
          <p className={styles.muted} style={{ padding: '1rem' }}>
            در حال بارگذاری...
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>تصویر</th>
                <th>نام</th>
                <th>دسته</th>
                <th>قیمت</th>
                <th>موجودی</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image} alt="" className={styles.thumb} />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{formatPrice(getSalePrice(product))}</td>
                  <td>{new Intl.NumberFormat('fa-IR').format(product.stock)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.ghostBtn}
                        onClick={() => startEdit(product)}
                      >
                        ویرایش
                      </button>
                      <button
                        type="button"
                        className={styles.dangerBtn}
                        onClick={() => handleDelete(product.id)}
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

      <div className={styles.pagination}>
        <button
          type="button"
          className={styles.ghostBtn}
          disabled={page <= 1}
          onClick={() => load(page - 1, query)}
        >
          قبلی
        </button>
        <span className={styles.muted}>
          صفحه {new Intl.NumberFormat('fa-IR').format(page)} از{' '}
          {new Intl.NumberFormat('fa-IR').format(totalPages)}
        </span>
        <button
          type="button"
          className={styles.ghostBtn}
          disabled={page >= totalPages}
          onClick={() => load(page + 1, query)}
        >
          بعدی
        </button>
      </div>
    </div>
  )
}
