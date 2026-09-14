import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useCart } from '@/contexts/CartContext'
import { getProductById } from '@/services/products/productService'
import { getPrimaryCategorySlug, getProductBadge, isInStock } from '@/utils/productHelpers'
import { ProductGallery } from '@/features/product-detail/ProductGallery/ProductGallery'
import { ProductInfo } from '@/features/product-detail/ProductInfo/ProductInfo'
import { ProductPurchaseActions } from '@/features/product-detail/ProductPurchaseActions/ProductPurchaseActions'
import { RelatedProducts } from '@/features/product-detail/RelatedProducts/RelatedProducts'
import styles from './ProductDetailPage.module.css'

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { data: product, loading } = useAsyncData(`product-${id}`, () =>
    getProductById(id ?? ''),
  )

  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setQuantity(1)
    setAdded(false)
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
  const inStock = isInStock(product)

  async function handleAddToCart() {
    if (!inStock || adding) return
    setAdding(true)
    try {
      await addItem(product, quantity)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } finally {
      setAdding(false)
    }
  }

  const purchaseProps = {
    quantity,
    stock: product.stock,
    inStock,
    adding,
    added,
    onDecrease: () => setQuantity((value) => Math.max(1, value - 1)),
    onIncrease: () => setQuantity((value) => Math.min(product.stock || 99, value + 1)),
    onAddToCart: handleAddToCart,
    onGoToCart: () => navigate('/cart'),
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.layout}>
        <div className={styles.galleryColumn}>
          <ProductGallery
            images={gallery}
            name={product.name}
            badgeLabel={getProductBadge(product)}
          />
          <div className={styles.underGalleryBuy}>
            <ProductPurchaseActions {...purchaseProps} compact />
          </div>
        </div>
        <ProductInfo product={product} />
      </div>

      <RelatedProducts
        productId={product.id}
        category={getPrimaryCategorySlug(product)}
      />
    </div>
  )
}
