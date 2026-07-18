import { getProductBadge } from '@/utils/productHelpers'
import { ProductGallery } from '@/features/product-detail/ProductGallery/ProductGallery'
import { ProductInfo } from '@/features/product-detail/ProductInfo/ProductInfo'
import { ProductDetailsTabs } from '@/features/product-detail/ProductDetailsTabs/ProductDetailsTabs'
import { RelatedProducts } from '@/features/product-detail/RelatedProducts/RelatedProducts'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAsyncData } from '@/hooks/useAsyncData'
import { getProductById } from '@/services/products/productService'
import styles from './ProductDetailPage.module.css'

export function ProductDetailPage() {
  const { id } = useParams()
  const { data: product, loading } = useAsyncData(`product-${id}`, () =>
    getProductById(id ?? ''),
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  if (loading) {
    return (
      <div className={`container ${styles.page}`}>
        <div className={styles.loadingLayout}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonInfo}>
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLineShort} />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className={`container ${styles.page}`}>
        <div className={styles.notFound}>
          <h1>محصول یافت نشد</h1>
          <p>محصول مورد نظر وجود ندارد یا حذف شده است.</p>
          <Link to="/" className={styles.backLink}>
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    )
  }

  const gallery = product.images?.length ? product.images : [product.image]

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.layout}>
        <ProductGallery
          images={gallery}
          name={product.name}
          badgeLabel={getProductBadge(product)}
        />
        <ProductInfo product={product} />
      </div>

      <ProductDetailsTabs product={product} />
      <RelatedProducts productId={product.id} category={product.category} />
    </div>
  )
}
