import { TeamGeneratorType } from '@/grpc/generated/squad/enum'
import type { GenerateTeamRequest } from '@/grpc/generated/squad/method'
import { squadServiceClient } from '@/lib/api'

export async function generatedProject({
  projectId,
  newProject,
  generatorType = TeamGeneratorType.tgtDefault,
}: GenerateTeamRequest) {
  const response = await squadServiceClient.generateTeam({
    projectId,
    newProject,
    generatorType,
  })

  return response
}
