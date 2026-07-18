import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/utils/formatPrice'
import styles from './CartPage.module.css'

export function CartPage() {
  const { isAuthenticated } = useAuth()
  const { cart, loading, total, itemCount, updateQuantity, removeItem } = useCart()
  const navigate = useNavigate()

  function handleCheckout() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }
    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className={`container ${styles.page}`}>
        <p className={styles.muted}>در حال بارگذاری سبد خرید...</p>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className={`container ${styles.page}`}>
        <div className={styles.empty}>
          <h1 className={styles.title}>سبد خرید</h1>
          <p className={styles.muted}>سبد خرید شما خالی است.</p>
          <Link to="/" className={styles.primaryBtn}>
            مشاهده محصولات
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>سبد خرید</h1>
      <p className={styles.subtitle}>
        {new Intl.NumberFormat('fa-IR').format(itemCount)} کالا
      </p>

      <div className={styles.layout}>
        <ul className={styles.list}>
          {cart.items.map((item) => (
            <li key={item.productId} className={styles.item}>
              <Link to={`/products/${item.productId}`} className={styles.thumbLink}>
                <img src={item.image} alt={item.name} className={styles.thumb} />
              </Link>

              <div className={styles.itemBody}>
                <Link to={`/products/${item.productId}`} className={styles.itemName}>
                  {item.name}
                </Link>
                <p className={styles.itemPrice}>{formatPrice(item.price)}</p>

                <div className={styles.itemActions}>
                  <div className={styles.quantity}>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      aria-label="کاهش تعداد"
                    >
                      −
                    </button>
                    <span>{new Intl.NumberFormat('fa-IR').format(item.quantity)}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      aria-label="افزایش تعداد"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeItem(item.productId)}
                  >
                    حذف
                  </button>
                </div>
              </div>

              <p className={styles.lineTotal}>
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>خلاصه سفارش</h2>
          <div className={styles.summaryRow}>
            <span>جمع کل</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <button type="button" className={styles.checkoutBtn} onClick={handleCheckout}>
            ادامه و ثبت سفارش
          </button>
          {!isAuthenticated && (
            <p className={styles.loginHint}>
              برای ثبت سفارش باید{' '}
              <Link to="/login" state={{ from: '/checkout' }}>
                وارد شوید
              </Link>
            </p>
          )}
        </aside>
      </div>
    </div>
  )
}
