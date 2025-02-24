import { Order } from '@/grpc/generated/common/pagination'
import { squadServiceClient } from '@/lib/api'

export async function fetchProjects() {
  const response = await squadServiceClient.readAllProjects({
    pagination: {
      limit: 100,
      sortOptions: [
        {
          order: Order.ordAscending,
          sort: 'id',
        },
      ],
    },
  })

  return response.data
}
