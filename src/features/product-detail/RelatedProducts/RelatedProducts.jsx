import { useAsyncData } from '@/hooks/useAsyncData'
import { getRelatedProducts } from '@/services/products/productService'
import { SectionTitle } from '@/components/ui/SectionTitle/SectionTitle'
import { ProductGrid } from '@/components/products/ProductGrid/ProductGrid'
import styles from './RelatedProducts.module.css'

/**
 * @param {{
 *   productId: string
 *   category: import('@/types/product').ProductCategory
 * }} props
 */
export function RelatedProducts({ productId, category }) {
  const cacheKey = `related-${productId}-${category}`
  const { data: products, loading } = useAsyncData(cacheKey, () =>
    getRelatedProducts(productId, category),
  )

  if (!loading && (!products || products.length === 0)) {
    return null
  }

  return (
    <section className={styles.section}>
      <SectionTitle title="محصولات مرتبط" />
      <ProductGrid products={products ?? []} loading={loading} />
    </section>
  )
}
