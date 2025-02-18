import { squadServiceClient } from '@/lib/api'

export async function fetchCompetenceLevels() {
  const response = await squadServiceClient.readAllCompetenceLevels({
    pagination: { limit: 100 },
  })

  return response.data
}
