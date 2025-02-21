import { squadServiceClient } from '@/lib/api'

type FilterOperator = 0 | 1 | 2 | 3

interface SimpleFilter {
  simple: {
    filterKey: string
    value: string
    operator: FilterOperator
  }
}

export async function fetchAllStudents(filters?: SimpleFilter) {
  const response = await squadServiceClient.readAllStudentsInSubject({
    pagination: { limit: 100 },
    ...(filters ? { filters: [filters] } : {}),
  })

  return response.data
}
