import { Link } from "react-router-dom";
import { getSalePrice } from "@/utils/productHelpers";
import { ProductPrices } from "@/components/products/ProductPrices/ProductPrices";
import styles from "./ProductsDropdown.module.css";

/**
 * @param {{
 *   hotProducts: import('@/types/product').Product[]
 *   trends: import('@/types/product').Product[]
 * }} props
 */
export function ProductsDropdown({ hotProducts, trends }) {
  return (
    <div className={styles.dropdown}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>محصولات داغ</h3>
        <ul className={styles.list}>
          {hotProducts.map((product) => (
            <li key={product.id}>
              <Link to={`/products/${product.id}`} className={styles.item}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.thumb}
                />
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{product.name}</span>
                  <ProductPrices
                    installmentPrice={getSalePrice(product)}
                    compact
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>ترند ها</h3>
        <ul className={styles.list}>
          {trends.map((product) => (
            <li key={product.id}>
              <Link to={`/products/${product.id}`} className={styles.item}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.thumb}
                />
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{product.name}</span>
                  <ProductPrices
                    installmentPrice={getSalePrice(product)}
                    compact
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
