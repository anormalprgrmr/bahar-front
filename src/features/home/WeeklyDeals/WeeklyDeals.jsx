import { useAsyncData } from '@/hooks/useAsyncData'
import { getTrendProducts } from '@/services/products/productService'
import { SectionTitle } from '@/components/ui/SectionTitle/SectionTitle'
import { ProductGrid } from '@/components/products/ProductGrid/ProductGrid'
import styles from './WeeklyDeals.module.css'

export function WeeklyDeals() {
  const { data: products, loading } = useAsyncData('trends', getTrendProducts)

  return (
    <section className={styles.section}>
      <div className="container">
        <SectionTitle title="ترند ها" moreHref="/collections/trends" />
        <ProductGrid products={products ?? []} loading={loading} />
      </div>
    </section>
  )
}
