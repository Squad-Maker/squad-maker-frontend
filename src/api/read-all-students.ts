import { squadServiceClient } from '@/lib/api'

export async function fetchAllStudent() {
  const response = await squadServiceClient.readAllStudentsInSubject({
    pagination: { limit: 100 },
    filters: [
      {
        simple: {
          filterKey: 'inProject',
          value: 'false',
          operator: 0,
        },
      },
    ],
  })

  return response.data
}
