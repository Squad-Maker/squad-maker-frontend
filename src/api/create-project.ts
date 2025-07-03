import type { CreateProjectRequest } from '@/grpc/generated/squad/project'
import { squadServiceClient } from '@/lib/api'

export async function createProject({
  name,
  description,
  positions,
  competenceLevels,
  tools,
}: CreateProjectRequest) {
  const response = await squadServiceClient.createProject({
    name,
    description,
    positions,
    competenceLevels,
    tools,
  })

  return response
}
