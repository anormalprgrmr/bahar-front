import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  adminBulkAdjustPrices,
  adminDeleteProduct,
  adminListProducts,
  adminUpdateProductPrice,
  adminUpdateProductStock,
} from "@/services/admin/adminProductService";
import { getProductCategoryLabels, getSalePrice } from "@/utils/productHelpers";
import { useCategories } from "@/hooks/useCategories";
import {
  isTrendProduct,
  setTrendProduct,
} from "@/services/products/trendService";
import styles from "./AdminShared.module.css";

export function AdminProductsPage() {
  const location = useLocation();
  const { categories } = useCategories();
  const [products, setProducts] = useState(
    /** @type {import('@/types/product').Product[]} */ ([]),
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [publicationFilter, setPublicationFilter] = useState("");
  const [saleFilter, setSaleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priceDrafts, setPriceDrafts] = useState(
    /** @type {Record<string, string>} */ ({}),
  );
  const [savingPriceId, setSavingPriceId] = useState("");
  const [stockDrafts, setStockDrafts] = useState(
    /** @type {Record<string, string>} */ ({}),
  );
  const [savingStockId, setSavingStockId] = useState("");
  const [bulkDirection, setBulkDirection] = useState("increase");
  const [bulkMode, setBulkMode] = useState("fixed");
  const [bulkAmount, setBulkAmount] = useState("");
  const [bulkSaving, setBulkSaving] = useState(false);
  const [success, setSuccess] = useState(
    /** @type {string} */ (location.state?.success ?? ""),
  );

  useEffect(() => {
    if (location.state?.success) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  async function load(nextPage = page, q = query) {
    setLoading(true);
    setError("");
    try {
      const result = await adminListProducts({
        page: nextPage,
        pageSize: 10,
        q: q || undefined,
        category: categoryFilter || undefined,
        inStock: stockFilter === "" ? undefined : stockFilter === "true",
        isPublished:
          publicationFilter === "" ? undefined : publicationFilter === "true",
        onSale: saleFilter === "" ? undefined : saleFilter === "true",
      });
      setProducts(result.data);
      setPriceDrafts({});
      setStockDrafts({});
      setTotalPages(result.pagination?.total_pages || 1);
      setPage(result.pagination?.page || nextPage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "بارگذاری محصولات ناموفق بود.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1, "");
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("این محصول حذف شود؟")) return;
    setError("");
    setSuccess("");
    try {
      await adminDeleteProduct(id);
      setTrendProduct(id, false);
      setSuccess("محصول حذف شد.");
      await load(page, query);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حذف محصول ناموفق بود.");
    }
  }

  async function handleQuickPriceSave(product) {
    const rawPrice = priceDrafts[product.id] ?? String(getSalePrice(product));
    const price = Number(rawPrice);
    if (
      rawPrice.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(price)
    ) {
      setError("قیمت باید عدد صحیح و نامنفی بر حسب تومان باشد.");
      return;
    }
    if (product.newPrice != null && price > product.price) {
      setError("قیمت نهایی نباید از قیمت اصلی بیشتر باشد.");
      return;
    }

    setError("");
    setSuccess("");
    setSavingPriceId(product.id);
    try {
      await adminUpdateProductPrice(product, price);
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                price: item.newPrice != null ? item.price : price,
                newPrice: item.newPrice != null ? price : item.newPrice,
              }
            : item,
        ),
      );
      setPriceDrafts((current) => {
        const next = { ...current };
        delete next[product.id];
        return next;
      });
      setSuccess("قیمت محصول به‌روزرسانی شد.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "به‌روزرسانی قیمت ناموفق بود.",
      );
    } finally {
      setSavingPriceId("");
    }
  }

  async function handleQuickStockSave(product) {
    const rawStock = stockDrafts[product.id] ?? String(product.stock);
    const stock = Number(rawStock);
    if (
      rawStock.trim() === "" ||
      !Number.isFinite(stock) ||
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      setError("موجودی باید عدد صحیح و نامنفی باشد.");
      return;
    }

    setError("");
    setSuccess("");
    setSavingStockId(product.id);
    try {
      await adminUpdateProductStock(product, stock);
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id ? { ...item, stock } : item,
        ),
      );
      setStockDrafts((current) => {
        const next = { ...current };
        delete next[product.id];
        return next;
      });
      setSuccess("موجودی محصول به‌روزرسانی شد.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "به‌روزرسانی موجودی ناموفق بود.",
      );
    } finally {
      setSavingStockId("");
    }
  }

  async function handleBulkPriceAdjustment(event) {
    event.preventDefault();
    const amount = Number(bulkAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("مقدار تغییر باید بزرگ‌تر از صفر باشد.");
      return;
    }
    if (bulkMode === "fixed" && !Number.isInteger(amount)) {
      setError("مقدار ثابت باید عدد صحیح و بر حسب تومان باشد.");
      return;
    }
    if (
      bulkDirection === "decrease" &&
      bulkMode === "percent" &&
      amount > 100
    ) {
      setError("درصد کاهش نمی‌تواند بیشتر از ۱۰۰ باشد.");
      return;
    }
    if (bulkMode === "percent" && amount > 10000) {
      setError("درصد نمی‌تواند بیشتر از ۱۰۰۰۰ باشد.");
      return;
    }

    const amountLabel =
      bulkMode === "percent" ? `${amount}٪` : `${amount} تومان`;
    const directionLabel = bulkDirection === "increase" ? "افزایش" : "کاهش";
    if (
      !window.confirm(
        `قیمت تمام محصولات (حتی خارج از صفحه یا فیلتر فعلی) ${directionLabel} ${amountLabel} داده شود؟ این تغییر روی قیمت اصلی و قیمت تخفیف‌خورده اعمال می‌شود.`,
      )
    ) {
      return;
    }

    setError("");
    setSuccess("");
    setBulkSaving(true);
    try {
      const result = await adminBulkAdjustPrices({
        direction: bulkDirection,
        mode: bulkMode,
        amount,
      });
      setSuccess(
        `قیمت ${new Intl.NumberFormat("fa-IR").format(result.updated)} محصول به‌روزرسانی شد.`,
      );
      setBulkAmount("");
      await load(page, query);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "تغییر گروهی قیمت‌ها ناموفق بود.",
      );
    } finally {
      setBulkSaving(false);
    }
  }

  function handleTrendChange(productId, selected) {
    setTrendProduct(productId, selected);
    setProducts((current) => [...current]);
    setError("");
    setSuccess(
      selected ? "محصول به ترندها اضافه شد." : "محصول از ترندها حذف شد.",
    );
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>مدیریت محصولات</h1>
          <p className={styles.subtitle}>لیست محصولات فروشگاه</p>
        </div>
        <Link to="/admin/products/new" className={styles.primaryBtn}>
          ایجاد محصول
        </Link>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <form
        className={styles.bulkPricePanel}
        onSubmit={handleBulkPriceAdjustment}
      >
        <div>
          <h2>تغییر قیمت همه محصولات</h2>
          <p>
            این عملیات کل محصولات فروشگاه را تغییر می‌دهد، نه فقط نتایج صفحه یا
            فیلتر فعلی. قیمت اصلی و قیمت تخفیف‌خورده با هم تنظیم می‌شوند.
          </p>
        </div>
        <div className={styles.bulkPriceControls}>
          <select
            className={styles.select}
            value={bulkDirection}
            onChange={(event) => setBulkDirection(event.target.value)}
            aria-label="نوع تغییر قیمت"
          >
            <option value="increase">افزایش</option>
            <option value="decrease">کاهش</option>
          </select>
          <select
            className={styles.select}
            value={bulkMode}
            onChange={(event) => setBulkMode(event.target.value)}
            aria-label="واحد تغییر قیمت"
          >
            <option value="fixed">مبلغ ثابت (تومان)</option>
            <option value="percent">درصد</option>
          </select>
          <input
            className={styles.bulkPriceInput}
            type="number"
            min="0"
            step={bulkMode === "fixed" ? "1" : "0.1"}
            value={bulkAmount}
            onChange={(event) => setBulkAmount(event.target.value)}
            placeholder={bulkMode === "fixed" ? "مبلغ به تومان" : "درصد"}
            aria-label={
              bulkMode === "fixed" ? "مبلغ تغییر به تومان" : "درصد تغییر"
            }
            required
          />
          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={bulkSaving || bulkAmount.trim() === ""}
          >
            {bulkSaving ? "در حال اعمال..." : "اعمال روی همه محصولات"}
          </button>
        </div>
      </form>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="جستجو..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") load(1, query);
          }}
        />
        <select
          className={styles.select}
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          aria-label="فیلتر دسته‌بندی"
        >
          <option value="">همه دسته‌ها</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={stockFilter}
          onChange={(event) => setStockFilter(event.target.value)}
          aria-label="فیلتر موجودی"
        >
          <option value="">همه موجودی‌ها</option>
          <option value="true">موجود</option>
          <option value="false">ناموجود</option>
        </select>
        <select
          className={styles.select}
          value={publicationFilter}
          onChange={(event) => setPublicationFilter(event.target.value)}
          aria-label="فیلتر انتشار"
        >
          <option value="">منتشرشده و پیش‌نویس</option>
          <option value="true">منتشرشده</option>
          <option value="false">پیش‌نویس</option>
        </select>
        <select
          className={styles.select}
          value={saleFilter}
          onChange={(event) => setSaleFilter(event.target.value)}
          aria-label="فیلتر تخفیف"
        >
          <option value="">با تخفیف و بدون تخفیف</option>
          <option value="true">دارای تخفیف</option>
          <option value="false">بدون تخفیف</option>
        </select>
        <button
          type="button"
          className={styles.ghostBtn}
          onClick={() => load(1, query)}
        >
          جستجو / فیلتر
        </button>
      </div>

      <div className={styles.tableWrap}>
        {loading ? (
          <p className={styles.muted} style={{ padding: "1rem" }}>
            در حال بارگذاری...
          </p>
        ) : products.length === 0 ? (
          <p className={styles.muted} style={{ padding: "1rem" }}>
            محصولی وجود ندارد.
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>تصویر</th>
                <th>نام</th>
                <th>دسته</th>
                <th>قیمت</th>
                <th>موجودی</th>
                <th>انتشار</th>
                <th>ترند</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image} alt="" className={styles.thumb} />
                  </td>
                  <td>{product.name}</td>
                  <td>{getProductCategoryLabels(product, categories)}</td>
                  <td>
                    <div className={styles.quickPrice}>
                      <input
                        className={styles.quickPriceInput}
                        type="number"
                        min="0"
                        step="1"
                        value={
                          priceDrafts[product.id] ??
                          String(getSalePrice(product))
                        }
                        onChange={(event) =>
                          setPriceDrafts((current) => ({
                            ...current,
                            [product.id]: event.target.value,
                          }))
                        }
                        aria-label={`قیمت ${product.name} به تومان`}
                      />
                      <button
                        type="button"
                        className={styles.quickPriceBtn}
                        onClick={() => handleQuickPriceSave(product)}
                        disabled={
                          savingPriceId === product.id ||
                          Number(
                            priceDrafts[product.id] ??
                              String(getSalePrice(product)),
                          ) === getSalePrice(product)
                        }
                      >
                        {savingPriceId === product.id ? "..." : "ذخیره"}
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className={styles.quickPrice}>
                      <input
                        className={styles.quickPriceInput}
                        type="number"
                        min="0"
                        step="1"
                        value={stockDrafts[product.id] ?? String(product.stock)}
                        onChange={(event) =>
                          setStockDrafts((current) => ({
                            ...current,
                            [product.id]: event.target.value,
                          }))
                        }
                        aria-label={`موجودی ${product.name}`}
                      />
                      <button
                        type="button"
                        className={styles.quickPriceBtn}
                        onClick={() => handleQuickStockSave(product)}
                        disabled={
                          savingStockId === product.id ||
                          Number(
                            stockDrafts[product.id] ?? String(product.stock),
                          ) === product.stock
                        }
                      >
                        {savingStockId === product.id ? "..." : "ذخیره"}
                      </button>
                    </div>
                  </td>
                  <td>{product.isPublished ? "منتشرشده" : "پیش‌نویس"}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={isTrendProduct(product.id)}
                      onChange={(event) =>
                        handleTrendChange(product.id, event.target.checked)
                      }
                      aria-label={`انتخاب ${product.name} به‌عنوان ترند`}
                    />
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className={styles.ghostBtn}
                      >
                        ویرایش
                      </Link>
                      <button
                        type="button"
                        className={styles.dangerBtn}
                        onClick={() => handleDelete(product.id)}
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.pagination}>
        <button
          type="button"
          className={styles.ghostBtn}
          disabled={page <= 1}
          onClick={() => load(page - 1, query)}
        >
          قبلی
        </button>
        <span className={styles.muted}>
          صفحه {new Intl.NumberFormat("fa-IR").format(page)} از{" "}
          {new Intl.NumberFormat("fa-IR").format(totalPages)}
        </span>
        <button
          type="button"
          className={styles.ghostBtn}
          disabled={page >= totalPages}
          onClick={() => load(page + 1, query)}
        >
          بعدی
        </button>
      </div>
    </div>
  );
}
