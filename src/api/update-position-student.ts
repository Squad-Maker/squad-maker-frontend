import type { AddStudentToTeamRequest } from '@/grpc/generated/squad/method'
import { squadServiceClient } from '@/lib/api'

export async function updatePositionStudent({
  projectId,
  studentId,
  positionId,
}: AddStudentToTeamRequest) {
  const response = await squadServiceClient.addStudentToTeam({
    projectId,
    studentId,
    positionId,
  })

  return response
}
