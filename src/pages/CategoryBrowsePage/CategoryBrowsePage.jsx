import { Link, useParams } from 'react-router-dom'
import { Reveal } from '@/components/ui/Reveal/Reveal'
import { useCategories } from '@/hooks/useCategories'
import { findCategoryBySlug } from '@/services/categories/categoryService'
import {
  getSubcategories,
  getTopLevelCategories,
} from '@/utils/categoryHelpers'
import styles from './CategoryBrowsePage.module.css'

export function CategoryBrowsePage() {
  const { parentSlug } = useParams()
  const { categories, loading, error } = useCategories()

  const parentCategory = parentSlug ? findCategoryBySlug(categories, parentSlug) : null
  const topLevelCategories = getTopLevelCategories(categories)
  const subcategories = parentCategory ? getSubcategories(categories, parentCategory.id) : []

  if (loading) {
    return (
      <div className={`container ${styles.page}`}>
        <p className={styles.muted}>در حال بارگذاری...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`container ${styles.page}`}>
        <p className={styles.error}>
          {error instanceof Error ? error.message : 'بارگذاری دسته‌بندی‌ها ناموفق بود.'}
        </p>
      </div>
    )
  }

  if (parentSlug && !parentCategory) {
    return (
      <div className={`container ${styles.page}`}>
        <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
          <Link to="/">خانه</Link>
          <span>/</span>
          <Link to="/shop">دسته‌بندی‌ها</Link>
        </nav>
        <p className={styles.error}>دسته‌بندی یافت نشد.</p>
      </div>
    )
  }

  if (parentCategory) {
    const hasSubcategories = subcategories.length > 0

    return (
      <div className={`container ${styles.page}`}>
        <Reveal>
          <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
            <Link to="/">خانه</Link>
            <span>/</span>
            <Link to="/shop">دسته‌بندی‌ها</Link>
            <span>/</span>
            <span>{parentCategory.name}</span>
          </nav>

          <header className={styles.header}>
            <h1 className={styles.title}>{parentCategory.name}</h1>
            <p className={styles.subtitle}>
              {hasSubcategories ? 'زیردسته مورد نظر را انتخاب کنید' : 'محصولات این دسته‌بندی'}
            </p>
          </header>
        </Reveal>

        {hasSubcategories ? (
          <div className={styles.grid}>
            {subcategories.map((category, index) => (
              <Reveal key={category.id} delay={index * 40}>
                <Link to={`/categories/${category.slug}`} className={styles.card}>
                  <span className={styles.cardTitle}>{category.name}</span>
                  <span className={styles.cardHint}>مشاهده محصولات</span>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <Link to={`/categories/${parentCategory.slug}`} className={styles.cta}>
              مشاهده محصولات {parentCategory.name}
            </Link>
          </Reveal>
        )}
      </div>
    )
  }

  return (
    <div className={`container ${styles.page}`}>
      <Reveal>
        <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
          <Link to="/">خانه</Link>
          <span>/</span>
          <span>دسته‌بندی‌ها</span>
        </nav>

        <header className={styles.header}>
          <h1 className={styles.title}>دسته‌بندی‌ها</h1>
          <p className={styles.subtitle}>دسته‌بندی مورد نظر را انتخاب کنید</p>
        </header>
      </Reveal>

      {topLevelCategories.length === 0 ? (
        <p className={styles.muted}>دسته‌بندی‌ای وجود ندارد.</p>
      ) : (
        <div className={styles.grid}>
          {topLevelCategories.map((category, index) => {
            const children = getSubcategories(categories, category.id)
            const target =
              children.length > 0 ? `/shop/${category.slug}` : `/categories/${category.slug}`

            return (
              <Reveal key={category.id} delay={index * 40}>
                <Link to={target} className={styles.card}>
                  <span className={styles.cardTitle}>{category.name}</span>
                  <span className={styles.cardHint}>
                    {children.length > 0 ? 'مشاهده زیردسته‌ها' : 'مشاهده محصولات'}
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      )}
    </div>
  )
}
