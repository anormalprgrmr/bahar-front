/**
 * @param {string | null | undefined} value
 * @returns {string[]}
 */
export function parseProductKeywords(value) {
  if (!value?.trim()) return []

  return [...new Set(
    value
      .split(/[\n,،;]+/)
      .map((keyword) => keyword.trim())
      .filter(Boolean),
  )]
}
