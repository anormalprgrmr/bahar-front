import { useAsyncData } from '@/hooks/useAsyncData'
import { getWeeklyDeals } from '@/services/products/productService'
import { SectionTitle } from '@/components/ui/SectionTitle/SectionTitle'
import { ProductGrid } from '@/components/products/ProductGrid/ProductGrid'
import styles from './WeeklyDeals.module.css'

export function WeeklyDeals() {
  const { data: products, loading } = useAsyncData('weekly-deals', getWeeklyDeals)

  return (
    <section className={styles.section}>
      <div className="container">
        <SectionTitle title="تخفیف‌های هفته" />
        <ProductGrid products={products ?? []} loading={loading} />
      </div>
    </section>
  )
}
