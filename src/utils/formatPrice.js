/**
 * @param {number} amount
 */
export function formatPrice(amount) {
  return `${new Intl.NumberFormat('fa-IR').format(amount)} تومان`
}

/**
 * @param {import('@/types/product').ProductBadge} [badge]
 */
export function getBadgeLabel(badge) {
  const labels = {
    discount: 'تخفیف',
    hot: 'داغ',
    bestseller: 'پرفروش',
  }

  return badge ? labels[badge] : null
}
