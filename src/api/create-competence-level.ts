import { CreateCompetenceLevelRequest } from '@/grpc/generated/squad/competence-level'
import { squadServiceClient } from '@/lib/api'

export async function createCompetenceLevel({
  name,
}: CreateCompetenceLevelRequest) {
  const response = await squadServiceClient.createCompetenceLevel({
    name,
  })

  return response
}
