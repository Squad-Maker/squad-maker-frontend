import type { GenerateTeamRequest } from '@/grpc/generated/squad/method'
import { squadServiceClient } from '@/lib/api'

export async function generatedProject({
  projectId,
  newProject,
}: GenerateTeamRequest) {
  const response = await squadServiceClient.generateTeam({
    projectId,
    newProject,
  })

  return response
}
