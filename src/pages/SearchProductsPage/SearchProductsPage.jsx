import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductCard } from '@/components/products/ProductCard/ProductCard'
import { ProductSearchForm } from '@/components/products/ProductSearchForm/ProductSearchForm'
import { Reveal } from '@/components/ui/Reveal/Reveal'
import { listProducts } from '@/services/products/productService'
import styles from './SearchProductsPage.module.css'

export function SearchProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''
  const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1)

  const [products, setProducts] = useState(/** @type {import('@/types/product').Product[]} */ ([]))
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query) {
      setProducts([])
      setTotalPages(1)
      setLoading(false)
      setError('')
      return
    }

    let cancelled = false

    async function loadProducts() {
      setLoading(true)
      setError('')
      try {
        const result = await listProducts({
          q: query,
          page,
          pageSize: 12,
        })
        if (!cancelled) {
          setProducts(result.data)
          setTotalPages(result.pagination?.total_pages || 1)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'جستجو ناموفق بود.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProducts()
    return () => {
      cancelled = true
    }
  }, [query, page])

  function goToPage(nextPage) {
    const params = new URLSearchParams(searchParams)
    if (nextPage <= 1) {
      params.delete('page')
    } else {
      params.set('page', String(nextPage))
    }
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={`container ${styles.page}`}>
      <Reveal>
        <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
          <Link to="/">خانه</Link>
          <span>/</span>
          <span>جستجو</span>
        </nav>

        <header className={styles.header}>
          <h1 className={styles.title}>جستجوی محصولات</h1>
          <ProductSearchForm initialQuery={query} className={styles.searchForm} />
        </header>
      </Reveal>

      {!query && (
        <p className={styles.muted}>عبارت مورد نظر خود را برای جستجو وارد کنید.</p>
      )}

      {query && !loading && !error && (
        <p className={styles.resultMeta}>
          {products.length > 0
            ? `نتایج جستجو برای «${query}»`
            : `محصولی برای «${query}» یافت نشد.`}
        </p>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {query && loading && <p className={styles.muted}>در حال جستجو...</p>}

      {query && !loading && products.length > 0 && (
        <div className={styles.grid}>
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 40}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}

      {query && !loading && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            قبلی
          </button>
          <span className={styles.muted}>
            صفحه {new Intl.NumberFormat('fa-IR').format(page)} از{' '}
            {new Intl.NumberFormat('fa-IR').format(totalPages)}
          </span>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  )
}
