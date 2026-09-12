import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '@/components/products/ProductCard/ProductCard'
import { Reveal } from '@/components/ui/Reveal/Reveal'
import {
  getRecentlyAddedProducts,
  getTrendProducts,
  listProducts,
} from '@/services/products/productService'
import styles from './ProductCollectionPage.module.css'

const COLLECTION_CONFIG = {
  latest: {
    title: 'جدیدترین محصولات',
    load: () => getRecentlyAddedProducts(48),
  },
  trends: {
    title: 'ترند ها',
    load: () => getTrendProducts(48),
  },
  all: {
    title: 'همه محصولات',
    load: async () => {
      const result = await listProducts({ page: 1, pageSize: 48, sortBy: 'created_at', sortOrder: 'desc' })
      return result.data
    },
  },
}

export function ProductCollectionPage() {
  const { type = 'all' } = useParams()
  const config = COLLECTION_CONFIG[type] ?? COLLECTION_CONFIG.all
  const [products, setProducts] = useState(/** @type {import('@/types/product').Product[]} */ ([]))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const loader = (COLLECTION_CONFIG[type] ?? COLLECTION_CONFIG.all).load

    async function load() {
      setLoading(true)
      setError('')
      try {
        const result = await loader()
        if (!cancelled) setProducts(result)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'بارگذاری محصولات ناموفق بود.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [type])

  return (
    <div className={`container ${styles.page}`}>
      <Reveal>
        <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
          <Link to="/">خانه</Link>
          <span>/</span>
          <span>{config.title}</span>
        </nav>
        <header className={styles.header}>
          <h1 className={styles.title}>{config.title}</h1>
        </header>
      </Reveal>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <p className={styles.muted}>در حال بارگذاری...</p>
      ) : products.length === 0 ? (
        <p className={styles.muted}>محصولی یافت نشد.</p>
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
