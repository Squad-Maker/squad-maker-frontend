import { squadServiceClient } from '@/lib/api'

export async function fetchProjects() {
  const response = await squadServiceClient.readAllProjects({
    pagination: { limit: 100 },
  })

  return response.data
}
