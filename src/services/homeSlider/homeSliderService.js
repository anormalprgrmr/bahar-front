import { apiClient, resolveMediaUrl } from '@/services/api/client'

/**
 * @typedef {{ id: string, imageUrl: string, sortOrder?: number }} SliderImage
 */

/**
 * @param {any} item
 * @returns {SliderImage}
 */
function normalizeSliderImage(item) {
  return {
    id: item.id,
    imageUrl: resolveMediaUrl(item.imageUrl ?? item.image_url ?? ''),
    sortOrder: item.sortOrder ?? item.sort_order ?? 0,
  }
}

/** @returns {Promise<SliderImage[]>} */
export async function listSliderImages() {
  try {
    const result = await apiClient('/slider')
    return (Array.isArray(result) ? result : []).map(normalizeSliderImage)
  } catch {
    return []
  }
}

/**
 * @param {File} file
 * @returns {Promise<SliderImage>}
 */
export async function adminUploadSliderImage(file) {
  const formData = new FormData()
  formData.append('image', file)
  const result = await apiClient('/slider/images', {
    method: 'POST',
    auth: true,
    formData,
  })
  return normalizeSliderImage(result)
}

/**
 * @param {string} id
 */
export async function adminDeleteSliderImage(id) {
  return apiClient(`/slider/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}
