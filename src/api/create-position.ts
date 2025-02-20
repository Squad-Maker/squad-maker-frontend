import { CreatePositionRequest } from '@/grpc/generated/squad/position'
import { squadServiceClient } from '@/lib/api'

export async function createPosition({ name }: CreatePositionRequest) {
  const response = await squadServiceClient.createPosition({
    name,
  })

  return response
}
