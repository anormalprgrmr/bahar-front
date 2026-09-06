import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  adminCreateProduct,
  adminUpdateProduct,
  adminUploadProductImage,
  adminUploadProductImages,
} from '@/services/admin/adminProductService'
import { adminListCategories } from '@/services/admin/adminCategoryService'
import { getProductById } from '@/services/products/productService'
import { resolveMediaUrl, toApiImagePath } from '@/services/api/client'
import { getSubcategories, getTopLevelCategories } from '@/utils/categoryHelpers'
import styles from './AdminShared.module.css'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  newPrice: '',
  stock: '0',
  categoryIds: [],
  country: '',
  skinType: '',
  famousProducts: '',
  suitableFor: '',
  keywords: '',
  onSale: false,
}

/**
 * @param {File} file
 */
function createPreviewUrl(file) {
  return URL.createObjectURL(file)
}

export function AdminProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [categories, setCategories] = useState(
    /** @type {import('@/types/category').Category[]} */ ([]),
  )
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [mainImageUrl, setMainImageUrl] = useState('')
  const [mainImageFile, setMainImageFile] = useState(/** @type {File | null} */ (null))
  const [mainImagePreview, setMainImagePreview] = useState('')

  const [sliderImageUrls, setSliderImageUrls] = useState(/** @type {string[]} */ ([]))
  const [sliderImageFiles, setSliderImageFiles] = useState(/** @type {File[]} */ ([]))
  const [sliderImagePreviews, setSliderImagePreviews] = useState(/** @type {string[]} */ ([]))

  useEffect(() => {
    return () => {
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview)
      sliderImagePreviews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [mainImagePreview, sliderImagePreviews])

  useEffect(() => {
    let cancelled = false

    async function loadCategories() {
      try {
        const result = await adminListCategories()
        if (!cancelled) setCategories(result)
      } catch {
        if (!cancelled) setCategories([])
      }
    }

    loadCategories()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function loadProduct() {
      setLoading(true)
      setError('')
      try {
        const [product, categoryList] = await Promise.all([
          getProductById(id),
          adminListCategories(),
        ])
        if (cancelled) return
        if (!product) {
          setError('محصول یافت نشد.')
          return
        }

        setCategories(categoryList)
        const initialCategoryIds =
          product.categoryIds?.length
            ? product.categoryIds
            : product.categories?.map((category) => category.id) ??
              (product.category
                ? categoryList
                    .filter((category) => category.slug === product.category)
                    .map((category) => category.id)
                : [])

        setForm({
          name: product.name,
          description: product.description,
          price: String(product.price),
          newPrice: product.newPrice != null ? String(product.newPrice) : '',
          stock: String(product.stock ?? 0),
          categoryIds: initialCategoryIds,
          country: product.country ?? '',
          skinType: product.skinType ?? '',
          famousProducts: product.famousProducts ?? '',
          suitableFor: product.suitableFor ?? '',
          keywords: product.keywords ?? '',
          onSale: Boolean(product.onSale),
        })

        const mainPath = toApiImagePath(product.image)
        const allImages = (product.images ?? []).map((image) => toApiImagePath(image))
        const sliderPaths = allImages.filter((image) => image && image !== mainPath)

        setMainImageUrl(mainPath)
        setSliderImageUrls(sliderPaths)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'بارگذاری محصول ناموفق بود.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProduct()
    return () => {
      cancelled = true
    }
  }, [id])

  function handleMainImageChange(event) {
    const file = event.target.files?.[0] ?? null
    if (mainImagePreview) URL.revokeObjectURL(mainImagePreview)

    setMainImageFile(file)
    setMainImagePreview(file ? createPreviewUrl(file) : '')
    event.target.value = ''
  }

  function handleRemoveMainImage() {
    if (mainImagePreview) URL.revokeObjectURL(mainImagePreview)
    setMainImageFile(null)
    setMainImagePreview('')
    setMainImageUrl('')
  }

  function handleSliderImagesChange(event) {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return

    const previews = files.map(createPreviewUrl)
    setSliderImageFiles((current) => [...current, ...files])
    setSliderImagePreviews((current) => [...current, ...previews])
    event.target.value = ''
  }

  function handleRemoveExistingSliderImage(index) {
    setSliderImageUrls((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  function handleRemoveNewSliderImage(index) {
    setSliderImageFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))
    setSliderImagePreviews((current) => {
      const preview = current[index]
      if (preview) URL.revokeObjectURL(preview)
      return current.filter((_, itemIndex) => itemIndex !== index)
    })
  }

  function toggleCategory(categoryId) {
    setForm((current) => {
      const exists = current.categoryIds.includes(categoryId)
      return {
        ...current,
        categoryIds: exists
          ? current.categoryIds.filter((id) => id !== categoryId)
          : [...current.categoryIds, categoryId],
      }
    })
  }

  function buildPayload() {
    const newPriceRaw = form.newPrice.trim()
    const mainPath = mainImageUrl.trim()
    const sliderPaths = sliderImageUrls.map((url) => url.trim()).filter(Boolean)
    const images = mainPath
      ? [mainPath, ...sliderPaths.filter((url) => url !== mainPath)]
      : sliderPaths

    /** @type {import('@/types/product').ProductUpsertPayload} */
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      newPrice: newPriceRaw === '' ? null : Number(newPriceRaw),
      image: mainPath,
      stock: Number(form.stock) || 0,
      images,
      categoryIds: form.categoryIds,
      onSale: form.onSale,
    }

    if (form.country.trim()) payload.country = form.country.trim()
    if (form.skinType.trim()) payload.skinType = form.skinType.trim()
    if (form.famousProducts.trim()) payload.famousProducts = form.famousProducts.trim()
    if (form.suitableFor.trim()) payload.suitableFor = form.suitableFor.trim()
    if (form.keywords.trim()) payload.keywords = form.keywords.trim()

    return payload
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const hasMainImage = Boolean(mainImageUrl || mainImageFile)
      if (!hasMainImage) {
        throw new Error('تصویر اصلی محصول الزامی است.')
      }

      const payload = buildPayload()
      if (!payload.name || !payload.description) {
        throw new Error('نام و توضیحات الزامی است.')
      }

      if (!payload.categoryIds?.length) {
        throw new Error('انتخاب حداقل یک دسته‌بندی الزامی است.')
      }

      let productId = id

      if (isEditing && id) {
        await adminUpdateProduct(id, payload)
      } else {
        const created = await adminCreateProduct({
          ...payload,
          image: '',
          images: [],
        })
        productId = created.id
      }

      if (!productId) {
        throw new Error('شناسه محصول نامعتبر است.')
      }

      if (mainImageFile) {
        await adminUploadProductImage(productId, mainImageFile, true)
      }

      if (sliderImageFiles.length > 0) {
        await adminUploadProductImages(productId, sliderImageFiles, false)
      }

      navigate('/admin/products', {
        state: { success: isEditing ? 'محصول به‌روزرسانی شد.' : 'محصول ایجاد شد.' },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ذخیره محصول ناموفق بود.')
    } finally {
      setSaving(false)
    }
  }

  const mainPreviewSrc = mainImagePreview || (mainImageUrl ? resolveMediaUrl(mainImageUrl) : '')
  const topLevelCategories = getTopLevelCategories(categories)

  if (loading) {
    return (
      <div>
        <Link to="/admin/products" className={styles.backLink}>
          ← بازگشت به لیست محصولات
        </Link>
        <p className={styles.muted}>در حال بارگذاری...</p>
      </div>
    )
  }

  return (
    <div>
      <Link to="/admin/products" className={styles.backLink}>
        ← بازگشت به لیست محصولات
      </Link>

      <h1 className={styles.title}>{isEditing ? 'ویرایش محصول' : 'ایجاد محصول'}</h1>
      <p className={styles.subtitle}>
        {isEditing ? 'اطلاعات محصول را ویرایش کنید' : 'محصول جدید به فروشگاه اضافه کنید'}
      </p>

      {error && <p className={styles.error}>{error}</p>}

      {categories.length === 0 && (
        <p className={styles.error}>
          ابتدا از{' '}
          <Link to="/admin/categories/new">اینجا</Link> یک دسته‌بندی ایجاد کنید.
        </p>
      )}

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label}>نام</label>
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>دسته‌بندی‌ها</label>
            <div className={styles.checkboxGroup}>
              {topLevelCategories.map((parent) => {
                const children = getSubcategories(categories, parent.id)

                if (children.length === 0) {
                  return (
                    <label key={parent.id} className={styles.checkboxRow}>
                      <input
                        type="checkbox"
                        checked={form.categoryIds.includes(parent.id)}
                        onChange={() => toggleCategory(parent.id)}
                      />
                      <span>{parent.name}</span>
                    </label>
                  )
                }

                return (
                  <div key={parent.id} className={styles.checkboxGroupSection}>
                    <label className={styles.checkboxRow}>
                      <input
                        type="checkbox"
                        checked={form.categoryIds.includes(parent.id)}
                        onChange={() => toggleCategory(parent.id)}
                      />
                      <span>{parent.name}</span>
                    </label>
                    {children.map((child) => (
                      <label key={child.id} className={`${styles.checkboxRow} ${styles.checkboxIndented}`}>
                        <input
                          type="checkbox"
                          checked={form.categoryIds.includes(child.id)}
                          onChange={() => toggleCategory(child.id)}
                        />
                        <span>{child.name}</span>
                      </label>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>توضیحات</label>
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>قیمت</label>
            <input
              className={styles.input}
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>قیمت تخفیف‌خورده (اختیاری)</label>
            <input
              className={styles.input}
              type="number"
              min="0"
              value={form.newPrice}
              onChange={(e) => setForm((f) => ({ ...f, newPrice: e.target.value }))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>موجودی</label>
            <input
              className={styles.input}
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            />
          </div>
          <div className={styles.checkboxRow}>
            <input
              id="on-sale"
              type="checkbox"
              checked={form.onSale}
              onChange={(e) => setForm((f) => ({ ...f, onSale: e.target.checked }))}
            />
            <label htmlFor="on-sale">در تخفیف</label>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>کشور</label>
            <input
              className={styles.input}
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>برای چه پوستیه</label>
            <input
              className={styles.input}
              value={form.skinType}
              onChange={(e) => setForm((f) => ({ ...f, skinType: e.target.value }))}
            />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>معروف‌ترین محصولات</label>
            <textarea
              className={styles.textarea}
              value={form.famousProducts}
              onChange={(e) => setForm((f) => ({ ...f, famousProducts: e.target.value }))}
            />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>مناسب چه افرادیه</label>
            <textarea
              className={styles.textarea}
              value={form.suitableFor}
              onChange={(e) => setForm((f) => ({ ...f, suitableFor: e.target.value }))}
            />
          </div>

          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>کلمات کلیدی</label>
            <textarea
              className={styles.textarea}
              value={form.keywords}
              onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
              placeholder="هر کلمه در یک خط یا با ویرگول جدا کنید"
            />
          </div>

          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>تصویر اصلی</label>
            <p className={styles.hint}>فقط آپلود فایل — فرمت‌های JPG، PNG، WebP و GIF</p>
            {mainPreviewSrc ? (
              <div className={styles.imagePreviewCard}>
                <img src={mainPreviewSrc} alt="پیش‌نمایش تصویر اصلی" className={styles.imagePreview} />
                <div className={styles.imagePreviewActions}>
                  <label className={styles.fileBtn}>
                    تغییر تصویر
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className={styles.hiddenInput}
                      onChange={handleMainImageChange}
                    />
                  </label>
                  <button type="button" className={styles.removeImageBtn} onClick={handleRemoveMainImage}>
                    حذف
                  </button>
                </div>
              </div>
            ) : (
              <label className={styles.fileDrop}>
                انتخاب تصویر اصلی
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className={styles.hiddenInput}
                  onChange={handleMainImageChange}
                  required={!isEditing}
                />
              </label>
            )}
          </div>

          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>تصاویر اسلایدر</label>
            <p className={styles.hint}>می‌توانید چند تصویر برای گالری محصول آپلود کنید.</p>

            {(sliderImageUrls.length > 0 || sliderImagePreviews.length > 0) && (
              <div className={styles.imageGrid}>
                {sliderImageUrls.map((url, index) => (
                  <div key={`existing-${url}-${index}`} className={styles.imagePreviewCard}>
                    <img
                      src={resolveMediaUrl(url)}
                      alt={`اسلایدر ${index + 1}`}
                      className={styles.imagePreview}
                    />
                    <button
                      type="button"
                      className={styles.removeImageBtn}
                      onClick={() => handleRemoveExistingSliderImage(index)}
                    >
                      حذف
                    </button>
                  </div>
                ))}
                {sliderImagePreviews.map((preview, index) => (
                  <div key={`new-${preview}`} className={styles.imagePreviewCard}>
                    <img src={preview} alt={`اسلایدر جدید ${index + 1}`} className={styles.imagePreview} />
                    <button
                      type="button"
                      className={styles.removeImageBtn}
                      onClick={() => handleRemoveNewSliderImage(index)}
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className={styles.fileDrop}>
              افزودن تصویر اسلایدر
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className={styles.hiddenInput}
                multiple
                onChange={handleSliderImagesChange}
              />
            </label>
          </div>
        </div>

        <div className={styles.formActions}>
          <Link to="/admin/products" className={styles.ghostBtn}>
            انصراف
          </Link>
          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={saving || categories.length === 0}
          >
            {saving ? 'در حال ذخیره...' : isEditing ? 'ذخیره تغییرات' : 'ایجاد محصول'}
          </button>
        </div>
      </form>
    </div>
  )
}
