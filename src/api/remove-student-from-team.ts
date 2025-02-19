import type { RemoveStudentFromTeamRequest } from '@/grpc/generated/squad/method'
import { squadServiceClient } from '@/lib/api'

export async function removeStudentFromTeam({
  projectId,
  studentId,
}: RemoveStudentFromTeamRequest) {
  const response = await squadServiceClient.removeStudentFromTeam({
    projectId,
    studentId,
  })

  return response
}
