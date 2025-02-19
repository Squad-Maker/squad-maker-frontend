import type { UpdateStudentSubjectDataRequest } from '@/grpc/generated/squad/method'
import { squadServiceClient } from '@/lib/api'

export async function updateProfile({
  tools,
  competenceLevelId,
  positionOption1Id,
  positionOption2Id,
  preferredProjectId,
}: UpdateStudentSubjectDataRequest) {
  const response = await squadServiceClient.updateStudentSubjectData({
    tools,
    competenceLevelId,
    positionOption1Id,
    positionOption2Id,
    preferredProjectId,
  })

  return response
}
