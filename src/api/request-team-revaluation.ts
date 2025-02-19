import type { RequestTeamRevaluationRequest } from '@/grpc/generated/squad/method'
import { squadServiceClient } from '@/lib/api'

export async function requestTeamRevaluation({
  projectId,
  reason,
  desiredProjectId,
}: RequestTeamRevaluationRequest) {
  const response = await squadServiceClient.requestTeamRevaluation({
    projectId,
    reason,
    desiredProjectId,
  })

  return response
}
