import { BrowserHeaders } from 'browser-headers'

import { squadServiceClient } from '@/lib/api'

export async function fetchStudentData() {
  const token = localStorage.getItem('accessToken')

  if (!token) return

  const metadata = new BrowserHeaders({
    authorization: `Bearer ${token}`,
  })

  const response = await squadServiceClient.getStudentSubjectData({}, metadata)

  return response
}
