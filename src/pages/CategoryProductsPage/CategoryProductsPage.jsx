import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '@/components/products/ProductCard/ProductCard'
import { Reveal } from '@/components/ui/Reveal/Reveal'
import { findCategoryBySlug } from '@/services/categories/categoryService'
import { listProducts } from '@/services/products/productService'
import { useCategories } from '@/hooks/useCategories'
import styles from './CategoryProductsPage.module.css'

function ChevronStartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  )
}

export function CategoryProductsPage() {
  const { slug } = useParams()
  const { categories, loading: categoriesLoading } = useCategories()
  const [products, setProducts] = useState(/** @type {import('@/types/product').Product[]} */ ([]))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const category = findCategoryBySlug(categories, slug)
  const parentCategory = category?.parentId
    ? categories.find((item) => item.id === category.parentId)
    : null

  useEffect(() => {
    if (!slug) return
    let cancelled = false

    async function loadProducts() {
      setLoading(true)
      setError('')
      try {
        const result = await listProducts({
          page: 1,
          pageSize: 48,
          category: slug,
        })
        if (!cancelled) setProducts(result.data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'بارگذاری محصولات ناموفق بود.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProducts()
    return () => {
      cancelled = true
    }
  }, [slug])

  const pageLoading = categoriesLoading || loading
  const title = category?.name ?? slug ?? 'دسته‌بندی'
  const backHref = parentCategory ? `/shop/${parentCategory.slug}` : '/shop'
  const backLabel = parentCategory ? parentCategory.name : 'دسته‌بندی‌ها'

  return (
    <div className={`container ${styles.page}`}>
      <Reveal>
        <header className={styles.header}>
          <Link to={backHref} className={styles.backLink}>
            <ChevronStartIcon />
            <span>بازگشت به {backLabel}</span>
          </Link>

          <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
            <Link to="/">خانه</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link to="/shop">دسته‌بندی‌ها</Link>
            {parentCategory && (
              <>
                <span className={styles.breadcrumbSep}>/</span>
                <Link to={`/shop/${parentCategory.slug}`}>{parentCategory.name}</Link>
              </>
            )}
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>{title}</span>
          </nav>

          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>محصولات این دسته‌بندی</p>
        </header>
      </Reveal>

      {error && <p className={styles.error}>{error}</p>}

      {pageLoading ? (
        <p className={styles.muted}>در حال بارگذاری...</p>
      ) : products.length === 0 ? (
        <p className={styles.muted}>محصولی در این دسته‌بندی وجود ندارد.</p>
      ) : (
        <div className={styles.grid}>
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 30} className={styles.gridItem}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
