import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/products/ProductCard/ProductCard'
import { Reveal } from '@/components/ui/Reveal/Reveal'
import { useWishlist } from '@/contexts/WishlistContext'
import { getProductById } from '@/services/products/productService'
import styles from './WishlistPage.module.css'

export function WishlistPage() {
  const { wishlist, loading, removeItem } = useWishlist()
  const [products, setProducts] = useState(
    /** @type {import('@/types/product').Product[]} */ ([]),
  )
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      if (wishlist.items.length === 0) {
        setProducts([])
        setLoadingProducts(false)
        return
      }

      setLoadingProducts(true)
      try {
        const results = await Promise.all(
          wishlist.items.map((item) => getProductById(item.productId)),
        )
        if (!cancelled) {
          setProducts(results.filter(Boolean))
        }
      } finally {
        if (!cancelled) setLoadingProducts(false)
      }
    }

    if (!loading) {
      loadProducts()
    }

    return () => {
      cancelled = true
    }
  }, [wishlist.items, loading])

  const pageLoading = loading || loadingProducts

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>لیست علاقه‌مندی‌ها</h1>
        <p className={styles.subtitle}>
          محصولاتی که ذخیره کرده‌اید تا بعداً به آن‌ها برگردید.
        </p>
      </header>

      {pageLoading && <p className={styles.muted}>در حال بارگذاری...</p>}

      {!pageLoading && products.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.muted}>هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید.</p>
          <Link to="/" className={styles.link}>
            بازگشت به فروشگاه
          </Link>
        </div>
      )}

      {!pageLoading && products.length > 0 && (
        <div className={styles.grid}>
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 40}>
              <div className={styles.cardWrap}>
                <ProductCard product={product} />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeItem(product.id)}
                >
                  حذف از علاقه‌مندی‌ها
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
