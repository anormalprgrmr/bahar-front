/**
 * @param {number} amount
 */
export function formatPrice(amount) {
  return `${new Intl.NumberFormat('fa-IR').format(amount)} تومان`
}
