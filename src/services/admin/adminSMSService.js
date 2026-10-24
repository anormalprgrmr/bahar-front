import { apiClient } from '@/services/api/client'

export async function adminGetSMSRecipients() {
  return apiClient('/admin/sms/recipients', { auth: true })
}

export async function adminSendSMSBroadcast(message) {
  return apiClient('/admin/sms/broadcast', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ message, confirmed: true }),
  })
}
