import { useAsyncData } from '@/hooks/useAsyncData'
import { getFeaturedProducts } from '@/services/products/productService'
import { SectionTitle } from '@/components/ui/SectionTitle/SectionTitle'
import { ProductGrid } from '@/components/products/ProductGrid/ProductGrid'
import styles from './FeaturedProducts.module.css'

export function FeaturedProducts() {
  const { data: products, loading } = useAsyncData('featured', getFeaturedProducts)

  return (
    <section className={styles.section}>
      <div className="container">
        <SectionTitle title="جدیدترین محصولات" />
        <ProductGrid products={products ?? []} loading={loading} />
      </div>
    </section>
  )
}
