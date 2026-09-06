import { Link, useParams } from 'react-router-dom'
import { Reveal } from '@/components/ui/Reveal/Reveal'
import { useCategories } from '@/hooks/useCategories'
import { findCategoryBySlug } from '@/services/categories/categoryService'
import {
  getSubcategories,
  getTopLevelCategories,
} from '@/utils/categoryHelpers'
import styles from './CategoryBrowsePage.module.css'

function ChevronStartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  )
}

function ChevronEndIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

/**
 * @param {{
 *   parentCategory?: import('@/types/category').Category | null
 *   title: string
 *   subtitle: string
 * }} props
 */
function CategoryPageHeader({ parentCategory, title, subtitle }) {
  return (
    <header className={styles.header}>
      {parentCategory ? (
        <Link to="/shop" className={styles.backLink}>
          <ChevronStartIcon />
          <span>بازگشت به دسته‌بندی‌ها</span>
        </Link>
      ) : null}

      <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
        <Link to="/">خانه</Link>
        <span className={styles.breadcrumbSep}>/</span>
        {parentCategory ? (
          <>
            <Link to="/shop">دسته‌بندی‌ها</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>{parentCategory.name}</span>
          </>
        ) : (
          <span className={styles.breadcrumbCurrent}>دسته‌بندی‌ها</span>
        )}
      </nav>

      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </header>
  )
}

/**
 * @param {{
 *   categories: import('@/types/category').Category[]
 *   getTarget: (category: import('@/types/category').Category) => string
 *   getHint: (category: import('@/types/category').Category) => string
 * }} props
 */
function CategoryList({ categories, getTarget, getHint }) {
  return (
    <ul className={styles.list}>
      {categories.map((category, index) => (
        <li key={category.id}>
          <Reveal delay={index * 30} className={styles.revealItem}>
            <Link to={getTarget(category)} className={styles.card}>
              <span className={styles.cardBody}>
                <span className={styles.cardTitle}>{category.name}</span>
                <span className={styles.cardHint}>{getHint(category)}</span>
              </span>
              <ChevronEndIcon />
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}

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
        <CategoryPageHeader title="دسته‌بندی یافت نشد" subtitle="" />
        <p className={styles.error}>دسته‌بندی مورد نظر وجود ندارد.</p>
      </div>
    )
  }

  if (parentCategory) {
    const hasSubcategories = subcategories.length > 0

    return (
      <div className={`container ${styles.page}`}>
        <Reveal>
          <CategoryPageHeader
            parentCategory={parentCategory}
            title={parentCategory.name}
            subtitle={
              hasSubcategories ? 'زیردسته مورد نظر را انتخاب کنید' : 'محصولات این دسته‌بندی'
            }
          />
        </Reveal>

        {hasSubcategories ? (
          <CategoryList
            categories={subcategories}
            getTarget={(category) => `/categories/${category.slug}`}
            getHint={() => 'مشاهده محصولات'}
          />
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
        <CategoryPageHeader
          title="دسته‌بندی‌ها"
          subtitle="دسته‌بندی مورد نظر را انتخاب کنید"
        />
      </Reveal>

      {topLevelCategories.length === 0 ? (
        <p className={styles.muted}>دسته‌بندی‌ای وجود ندارد.</p>
      ) : (
        <CategoryList
          categories={topLevelCategories}
          getTarget={(category) => {
            const children = getSubcategories(categories, category.id)
            return children.length > 0 ? `/shop/${category.slug}` : `/categories/${category.slug}`
          }}
          getHint={(category) => {
            const children = getSubcategories(categories, category.id)
            return children.length > 0 ? 'مشاهده زیردسته‌ها' : 'مشاهده محصولات'
          }}
        />
      )}
    </div>
  )
}
