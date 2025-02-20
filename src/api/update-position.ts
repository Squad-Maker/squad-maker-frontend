import { UpdatePositionRequest } from '@/grpc/generated/squad/position'
import { squadServiceClient } from '@/lib/api'

export async function updatePosition({ id, name }: UpdatePositionRequest) {
  const response = await squadServiceClient.updatePosition({
    id,
    name,
  })

  return response
}
