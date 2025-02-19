import { FilterOperator } from '@/grpc/generated/common/pagination'
import { squadServiceClient } from '@/lib/api'

export async function fetchStudentProjects() {
  const response = await squadServiceClient.readAllProjects({
    pagination: {
      limit: 100,
    },
    filters: [
      {
        simple: {
          filterKey: 'inProject',
          operator: FilterOperator.foEqual,
          value: 'true',
        },
      },
    ],
  })

  return response.data
}
