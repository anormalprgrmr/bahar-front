import { ProductCard } from '@/components/products/ProductCard/ProductCard'
import styles from './ProductGrid.module.css'

/**
 * @param {{
 *   products: import('@/types/product').Product[]
 *   loading?: boolean
 * }} props
 */
export function ProductGrid({ products, loading = false }) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.skeleton} />
        ))}
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
