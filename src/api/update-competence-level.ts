import { UpdateCompetenceLevelRequest } from '@/grpc/generated/squad/competence-level'
import { squadServiceClient } from '@/lib/api'

export async function updateCompetenceLevel({
  id,
  name,
}: UpdateCompetenceLevelRequest) {
  const response = await squadServiceClient.updateCompetenceLevel({
    id,
    name,
  })

  return response
}
