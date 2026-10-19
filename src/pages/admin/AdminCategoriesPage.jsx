import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  adminDeleteCategory,
  adminListCategories,
  adminReorderCategories,
} from "@/services/admin/adminCategoryService";
import {
  getSubcategories,
  getTopLevelCategories,
} from "@/utils/categoryHelpers";
import styles from "./AdminShared.module.css";

export function AdminCategoriesPage() {
  const location = useLocation();
  const [categories, setCategories] = useState(
    /** @type {import('@/types/category').Category[]} */ ([]),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(
    /** @type {string} */ (location.state?.success ?? ""),
  );
  const [reorderingId, setReorderingId] = useState("");
  const [draggedCategory, setDraggedCategory] = useState(
    /** @type {{ id: string, parentId: string | null } | null} */ (null),
  );
  const [expandedCategoryIds, setExpandedCategoryIds] = useState(
    /** @type {Set<string>} */ (new Set()),
  );

  useEffect(() => {
    if (location.state?.success) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const result = await adminListCategories();
      setCategories(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "بارگذاری دسته‌بندی‌ها ناموفق بود.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("این دسته‌بندی حذف شود؟")) return;
    setError("");
    setSuccess("");
    try {
      await adminDeleteCategory(id);
      setSuccess("دسته‌بندی حذف شد.");
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "حذف دسته‌بندی ناموفق بود.",
      );
    }
  }

  /**
   * @param {string} categoryId
   * @param {string | null} parentId
   * @param {-1 | 1} direction
   */
  async function handleMove(categoryId, parentId, direction) {
    const siblings = parentId
      ? getSubcategories(categories, parentId)
      : getTopLevelCategories(categories);
    const currentIndex = siblings.findIndex(
      (category) => category.id === categoryId,
    );
    const targetIndex = currentIndex + direction;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= siblings.length)
      return;

    const nextOrder = [...siblings];
    const [moved] = nextOrder.splice(currentIndex, 1);
    nextOrder.splice(targetIndex, 0, moved);

    await saveOrder(
      parentId,
      nextOrder.map((category) => category.id),
      categoryId,
    );
  }

  /**
   * @param {string} targetId
   * @param {string | null} parentId
   */
  async function handleDrop(targetId, parentId) {
    if (
      !draggedCategory ||
      draggedCategory.parentId !== parentId ||
      draggedCategory.id === targetId
    ) {
      setDraggedCategory(null);
      return;
    }

    const siblings = parentId
      ? getSubcategories(categories, parentId)
      : getTopLevelCategories(categories);
    const sourceIndex = siblings.findIndex(
      (category) => category.id === draggedCategory.id,
    );
    const targetIndex = siblings.findIndex(
      (category) => category.id === targetId,
    );
    if (sourceIndex < 0 || targetIndex < 0) {
      setDraggedCategory(null);
      return;
    }

    const nextOrder = [...siblings];
    const [moved] = nextOrder.splice(sourceIndex, 1);
    nextOrder.splice(targetIndex, 0, moved);
    await saveOrder(
      parentId,
      nextOrder.map((category) => category.id),
      draggedCategory.id,
    );
    setDraggedCategory(null);
  }

  /**
   * @param {string | null} parentId
   * @param {string[]} orderedIds
   * @param {string} movingId
   */
  async function saveOrder(parentId, orderedIds, movingId) {
    setError("");
    setSuccess("");
    setReorderingId(movingId);
    try {
      await adminReorderCategories(parentId, orderedIds);
      setSuccess("ترتیب دسته‌بندی به‌روزرسانی شد.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تغییر ترتیب ناموفق بود.");
    } finally {
      setReorderingId("");
    }
  }

  function toggleCategory(categoryId) {
    setExpandedCategoryIds((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }

  function startDrag(event, categoryId, parentId) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", categoryId);
    setDraggedCategory({ id: categoryId, parentId });
  }

  const topLevelCategories = getTopLevelCategories(categories);

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>مدیریت دسته‌بندی‌ها</h1>
          <p className={styles.subtitle}>
            دسته‌ها را با کشیدن مرتب کنید و برای دیدن زیر‌دسته‌ها هر دسته را باز
            کنید.
          </p>
        </div>
        <Link to="/admin/categories/new" className={styles.primaryBtn}>
          ایجاد دسته‌بندی
        </Link>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      {loading ? (
        <p className={styles.muted} style={{ padding: "1rem" }}>
          در حال بارگذاری...
        </p>
      ) : topLevelCategories.length === 0 ? (
        <div className={styles.categoryEmpty}>دسته‌بندی‌ای وجود ندارد.</div>
      ) : (
        <div className={styles.categoryManager}>
          {topLevelCategories.map((category, categoryIndex) => {
            const children = getSubcategories(categories, category.id);
            const expanded = expandedCategoryIds.has(category.id);
            const moving = reorderingId === category.id;

            return (
              <section
                key={category.id}
                className={`${styles.categoryGroup} ${draggedCategory?.id === category.id ? styles.categoryDragging : ""}`}
                onDragOver={(event) => {
                  if (draggedCategory?.parentId === null)
                    event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  handleDrop(category.id, null);
                }}
              >
                <div className={styles.categoryGroupHeader}>
                  <button
                    type="button"
                    className={styles.categoryDragHandle}
                    draggable
                    onDragStart={(event) => startDrag(event, category.id, null)}
                    onDragEnd={() => setDraggedCategory(null)}
                    aria-label={`جابجایی دسته ${category.name}`}
                    title="برای جابجایی بکشید"
                  >
                    ⠿
                  </button>
                  <button
                    type="button"
                    className={styles.categoryToggle}
                    onClick={() => toggleCategory(category.id)}
                    aria-expanded={expanded}
                  >
                    <span className={styles.categoryChevron} aria-hidden="true">
                      {expanded ? "⌄" : "›"}
                    </span>
                    <span className={styles.categoryName}>{category.name}</span>
                    <span className={styles.categoryCount}>
                      {children.length} زیر‌دسته
                    </span>
                  </button>
                  <div className={styles.categoryGroupActions}>
                    <div className={styles.orderActions}>
                      <button
                        type="button"
                        className={styles.orderBtn}
                        disabled={categoryIndex === 0 || moving}
                        onClick={() => handleMove(category.id, null, -1)}
                        aria-label={`انتقال ${category.name} به بالا`}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className={styles.orderBtn}
                        disabled={
                          categoryIndex === topLevelCategories.length - 1 ||
                          moving
                        }
                        onClick={() => handleMove(category.id, null, 1)}
                        aria-label={`انتقال ${category.name} به پایین`}
                      >
                        ↓
                      </button>
                    </div>
                    <Link
                      to={`/admin/categories/${category.id}/edit`}
                      className={styles.ghostBtn}
                    >
                      ویرایش
                    </Link>
                    <button
                      type="button"
                      className={styles.dangerBtn}
                      onClick={() => handleDelete(category.id)}
                    >
                      حذف
                    </button>
                  </div>
                </div>
                {expanded && (
                  <div className={styles.subcategoryList}>
                    {children.length === 0 ? (
                      <p className={styles.categoryEmpty}>
                        این دسته زیر‌دسته‌ای ندارد.
                      </p>
                    ) : (
                      children.map((child, childIndex) => {
                        const childMoving = reorderingId === child.id;
                        return (
                          <div
                            key={child.id}
                            className={`${styles.subcategoryRow} ${draggedCategory?.id === child.id ? styles.categoryDragging : ""}`}
                            draggable
                            onDragStart={(event) =>
                              startDrag(event, child.id, category.id)
                            }
                            onDragEnd={() => setDraggedCategory(null)}
                            onDragOver={(event) => {
                              if (draggedCategory?.parentId === category.id)
                                event.preventDefault();
                            }}
                            onDrop={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              handleDrop(child.id, category.id);
                            }}
                          >
                            <span
                              className={styles.subcategoryDragHandle}
                              aria-hidden="true"
                            >
                              ⠿
                            </span>
                            <div className={styles.subcategoryInfo}>
                              <strong>{child.name}</strong>
                              <span>{child.slug}</span>
                            </div>
                            <span className={styles.categoryDate}>
                              {child.created_at
                                ? new Date(child.created_at).toLocaleDateString(
                                    "fa-IR",
                                  )
                                : "—"}
                            </span>
                            <div className={styles.categoryGroupActions}>
                              <div className={styles.orderActions}>
                                <button
                                  type="button"
                                  className={styles.orderBtn}
                                  disabled={childIndex === 0 || childMoving}
                                  onClick={() =>
                                    handleMove(child.id, category.id, -1)
                                  }
                                  aria-label={`انتقال ${child.name} به بالا`}
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  className={styles.orderBtn}
                                  disabled={
                                    childIndex === children.length - 1 ||
                                    childMoving
                                  }
                                  onClick={() =>
                                    handleMove(child.id, category.id, 1)
                                  }
                                  aria-label={`انتقال ${child.name} به پایین`}
                                >
                                  ↓
                                </button>
                              </div>
                              <Link
                                to={`/admin/categories/${child.id}/edit`}
                                className={styles.ghostBtn}
                              >
                                ویرایش
                              </Link>
                              <button
                                type="button"
                                className={styles.dangerBtn}
                                onClick={() => handleDelete(child.id)}
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
