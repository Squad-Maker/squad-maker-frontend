import { squadServiceClient } from '@/lib/api'

export async function fetchStudentData() {
  const response = await squadServiceClient.getStudentSubjectData({})

  return response
}
