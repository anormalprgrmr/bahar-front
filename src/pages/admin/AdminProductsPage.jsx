import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  adminDeleteProduct,
  adminListProducts,
  adminUpdateProductPrice,
  adminUpdateProductStock,
} from '@/services/admin/adminProductService'
import { getProductCategoryLabels, getSalePrice } from '@/utils/productHelpers'
import { useCategories } from '@/hooks/useCategories'
import { isTrendProduct, setTrendProduct } from '@/services/products/trendService'
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
  const [priceDrafts, setPriceDrafts] = useState(/** @type {Record<string, string>} */ ({}))
  const [savingPriceId, setSavingPriceId] = useState('')
  const [stockDrafts, setStockDrafts] = useState(/** @type {Record<string, string>} */ ({}))
  const [savingStockId, setSavingStockId] = useState('')
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
      setPriceDrafts({})
      setStockDrafts({})
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
      setTrendProduct(id, false)
      setSuccess('محصول حذف شد.')
      await load(page, query)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حذف محصول ناموفق بود.')
    }
  }

  async function handleQuickPriceSave(product) {
    const rawPrice = priceDrafts[product.id] ?? String(getSalePrice(product))
    const price = Number(rawPrice)
    if (rawPrice.trim() === '' || !Number.isFinite(price) || price < 0 || !Number.isInteger(price)) {
      setError('قیمت باید عدد صحیح و نامنفی بر حسب تومان باشد.')
      return
    }
    if (product.newPrice != null && price > product.price) {
      setError('قیمت نهایی نباید از قیمت اصلی بیشتر باشد.')
      return
    }

    setError('')
    setSuccess('')
    setSavingPriceId(product.id)
    try {
      await adminUpdateProductPrice(product, price)
      setProducts((current) => current.map((item) => item.id === product.id
        ? {
            ...item,
            price: item.newPrice != null ? item.price : price,
            newPrice: item.newPrice != null ? price : item.newPrice,
          }
        : item))
      setPriceDrafts((current) => {
        const next = { ...current }
        delete next[product.id]
        return next
      })
      setSuccess('قیمت محصول به‌روزرسانی شد.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'به‌روزرسانی قیمت ناموفق بود.')
    } finally {
      setSavingPriceId('')
    }
  }

  async function handleQuickStockSave(product) {
    const rawStock = stockDrafts[product.id] ?? String(product.stock)
    const stock = Number(rawStock)
    if (rawStock.trim() === '' || !Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) {
      setError('موجودی باید عدد صحیح و نامنفی باشد.')
      return
    }

    setError('')
    setSuccess('')
    setSavingStockId(product.id)
    try {
      await adminUpdateProductStock(product, stock)
      setProducts((current) => current.map((item) => item.id === product.id ? { ...item, stock } : item))
      setStockDrafts((current) => {
        const next = { ...current }
        delete next[product.id]
        return next
      })
      setSuccess('موجودی محصول به‌روزرسانی شد.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'به‌روزرسانی موجودی ناموفق بود.')
    } finally {
      setSavingStockId('')
    }
  }

  function handleTrendChange(productId, selected) {
    setTrendProduct(productId, selected)
    setProducts((current) => [...current])
    setError('')
    setSuccess(selected ? 'محصول به ترندها اضافه شد.' : 'محصول از ترندها حذف شد.')
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
                <th>ترند</th>
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
                  <td>
                    <div className={styles.quickPrice}>
                      <input
                        className={styles.quickPriceInput}
                        type="number"
                        min="0"
                        step="1"
                        value={priceDrafts[product.id] ?? String(getSalePrice(product))}
                        onChange={(event) =>
                          setPriceDrafts((current) => ({ ...current, [product.id]: event.target.value }))
                        }
                        aria-label={`قیمت ${product.name} به تومان`}
                      />
                      <button
                        type="button"
                        className={styles.quickPriceBtn}
                        onClick={() => handleQuickPriceSave(product)}
                        disabled={savingPriceId === product.id || Number(priceDrafts[product.id] ?? String(getSalePrice(product))) === getSalePrice(product)}
                      >
                        {savingPriceId === product.id ? '...' : 'ذخیره'}
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className={styles.quickPrice}>
                      <input
                        className={styles.quickPriceInput}
                        type="number"
                        min="0"
                        step="1"
                        value={stockDrafts[product.id] ?? String(product.stock)}
                        onChange={(event) =>
                          setStockDrafts((current) => ({ ...current, [product.id]: event.target.value }))
                        }
                        aria-label={`موجودی ${product.name}`}
                      />
                      <button
                        type="button"
                        className={styles.quickPriceBtn}
                        onClick={() => handleQuickStockSave(product)}
                        disabled={savingStockId === product.id || Number(stockDrafts[product.id] ?? String(product.stock)) === product.stock}
                      >
                        {savingStockId === product.id ? '...' : 'ذخیره'}
                      </button>
                    </div>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={isTrendProduct(product.id)}
                      onChange={(event) => handleTrendChange(product.id, event.target.checked)}
                      aria-label={`انتخاب ${product.name} به‌عنوان ترند`}
                    />
                  </td>
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
