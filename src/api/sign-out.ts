import { BrowserHeaders } from 'browser-headers'

import { authServiceClient } from '@/lib/api'

export async function signOut() {
  const token = localStorage.getItem('accessToken')

  if (!token) return

  try {
    const metadata = new BrowserHeaders({
      authorization: `Bearer ${token}`,
    })

    await authServiceClient.invalidateToken({}, metadata)
  } finally {
    localStorage.removeItem('accessToken')
  }
}
