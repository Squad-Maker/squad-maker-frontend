import { squadServiceClient } from '@/lib/api'

export async function generateAllTeams() {
  const response = await squadServiceClient.generateAllTeams({})

  return response
}
