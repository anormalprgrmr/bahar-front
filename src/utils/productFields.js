/**
 * @param {string | null | undefined} value
 */
export function hasProductField(value) {
  return Boolean(value?.trim())
}

/**
 * @param {import('@/types/product').Product} product
 */
export function getProductExtraSpecs(product) {
  /** @type {{ label: string, value: string }[]} */
  const specs = []

  if (hasProductField(product.country)) {
    specs.push({ label: 'کشور', value: product.country.trim() })
  }
  if (hasProductField(product.skinType)) {
    specs.push({ label: 'برای چه پوستیه', value: product.skinType.trim() })
  }
  if (hasProductField(product.famousProducts)) {
    specs.push({ label: 'معروف‌ترین محصولات', value: product.famousProducts.trim() })
  }
  if (hasProductField(product.suitableFor)) {
    specs.push({ label: 'مناسب چه افرادیه', value: product.suitableFor.trim() })
  }

  return specs
}
