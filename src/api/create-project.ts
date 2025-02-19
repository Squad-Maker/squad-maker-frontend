import type { CreateProjectRequest } from '@/grpc/generated/squad/project'
import { squadServiceClient } from '@/lib/api'

export async function createProject({
  name,
  description,
  positions,
}: CreateProjectRequest) {
  const response = await squadServiceClient.createProject({
    name,
    description,
    positions,
  })

  return response
}
