import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  adminDeleteProduct,
  adminListProducts,
} from '@/services/admin/adminProductService'
import { formatPrice } from '@/utils/formatPrice'
import { getProductCategoryLabels, getSalePrice } from '@/utils/productHelpers'
import { useCategories } from '@/hooks/useCategories'
import styles from './AdminShared.module.css'

export function AdminProductsPage() {
  const location = useLocation()
  const { categories } = useCategories()
  const [products, setProducts] = useState(/** @type {import('@/types/product').Product[]} */ ([]))
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [query, setQuery] = useState('')
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

  async function handleDelete(id) {
    if (!window.confirm('این محصول حذف شود؟')) return
    setError('')
    setSuccess('')
    try {
      await adminDeleteProduct(id)
      setSuccess('محصول حذف شد.')
      await load(page, query)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حذف محصول ناموفق بود.')
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>مدیریت محصولات</h1>
          <p className={styles.subtitle}>لیست محصولات فروشگاه</p>
        </div>
        <Link to="/admin/products/new" className={styles.primaryBtn}>
          ایجاد محصول
        </Link>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

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
        ) : products.length === 0 ? (
          <p className={styles.muted} style={{ padding: '1rem' }}>
            محصولی وجود ندارد.
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
                  <td>{getProductCategoryLabels(product, categories)}</td>
                  <td>{formatPrice(getSalePrice(product))}</td>
                  <td>{new Intl.NumberFormat('fa-IR').format(product.stock)}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className={styles.ghostBtn}
                      >
                        ویرایش
                      </Link>
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
