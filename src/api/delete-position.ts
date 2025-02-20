import { DeletePositionRequest } from '@/grpc/generated/squad/position'
import { squadServiceClient } from '@/lib/api'

export async function deletePosition({ id }: DeletePositionRequest) {
  const response = await squadServiceClient.deletePosition({
    id,
  })

  return response
}
