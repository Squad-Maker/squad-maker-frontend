import { BrowserHeaders } from 'browser-headers'

import { authServiceClient } from '@/lib/api'

export async function profile() {
  const token = localStorage.getItem('accessToken')

  if (!token) return

  const metadata = new BrowserHeaders({
    authorization: `Bearer ${token}`,
  })

  const response = await authServiceClient.me({}, metadata)

  return response
}
