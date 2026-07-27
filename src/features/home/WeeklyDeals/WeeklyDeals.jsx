import { useAsyncData } from '@/hooks/useAsyncData'
import { getMostSalesProducts } from '@/services/products/productService'
import { SectionTitle } from '@/components/ui/SectionTitle/SectionTitle'
import { ProductGrid } from '@/components/products/ProductGrid/ProductGrid'
import styles from './WeeklyDeals.module.css'

export function WeeklyDeals() {
  const { data: products, loading } = useAsyncData('most-sales', getMostSalesProducts)

  return (
    <section className={styles.section}>
      <div className="container">
        <SectionTitle title="پرفروش‌ترین‌ها" />
        <ProductGrid products={products ?? []} loading={loading} />
      </div>
    </section>
  )
}
