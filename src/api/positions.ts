import { squadServiceClient } from '@/lib/api'

export async function fetchPositions() {
  const response = await squadServiceClient.readAllPositions({
    pagination: { limit: 100 },
  })

  return response.data
}
