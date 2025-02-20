import { DeleteCompetenceLevelRequest } from '@/grpc/generated/squad/competence-level'
import { squadServiceClient } from '@/lib/api'

export async function deleteCompetenceLevel({
  id,
}: DeleteCompetenceLevelRequest) {
  const response = await squadServiceClient.deleteCompetenceLevel({
    id,
  })

  return response
}
