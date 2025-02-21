import type { DeleteProjectRequest } from '@/grpc/generated/squad/project'
import { squadServiceClient } from '@/lib/api'

export async function deleteProject({ id }: DeleteProjectRequest) {
  const response = await squadServiceClient.deleteProject({
    id,
  })

  return response
}
