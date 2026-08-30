import { ApiError, getApiBaseUrl } from '@/services/api/client'
import { getAccessToken } from '@/services/api/token'

/**
 * Download a full site backup archive (.tar.gz).
 */
export async function adminDownloadBackup() {
  const token = getAccessToken()
  const response = await fetch(`${getApiBaseUrl()}/admin/backup`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!response.ok) {
    let message = `خطای سرور (${response.status})`
    try {
      const payload = await response.json()
      if (payload?.message) message = payload.message
    } catch {
      // ignore non-json error bodies
    }
    throw new ApiError(message, response.status)
  }

  const blob = await response.blob()
  const disposition = response.headers.get('Content-Disposition') ?? ''
  const filenameMatch = disposition.match(/filename="([^"]+)"/)
  const filename = filenameMatch?.[1] ?? `bahar-backup-${Date.now()}.tar.gz`

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * @param {File} file
 */
export async function adminImportBackup(file) {
  const formData = new FormData()
  formData.append('backup', file)
  formData.append('confirm', 'true')

  const token = getAccessToken()
  const response = await fetch(`${getApiBaseUrl()}/admin/backup/import`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(payload?.message ?? `خطای سرور (${response.status})`, response.status)
  }

  return payload
}
