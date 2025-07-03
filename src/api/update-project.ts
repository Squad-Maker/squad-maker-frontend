import type { UpdateProjectRequest } from '@/grpc/generated/squad/project'
import { squadServiceClient } from '@/lib/api'

export async function updateProject({
  id,
  name,
  description,
  positions,
  competenceLevels,
  tools,
}: UpdateProjectRequest) {
  const response = await squadServiceClient.updateProject({
    id,
    name,
    description,
    positions,
    competenceLevels,
    tools,
  })

  return response
}
