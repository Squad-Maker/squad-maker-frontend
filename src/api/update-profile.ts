import { squadServiceClient } from '@/lib/api'

export interface SignInBody {
  tools: string[]
  competenceLevelId: string
  positionOption1Id: string
  positionOption2Id: string | undefined
  preferredProjectId: string | undefined
}

export async function updateProfile({
  tools,
  competenceLevelId,
  positionOption1Id,
  positionOption2Id,
  preferredProjectId,
}: SignInBody) {
  const response = await squadServiceClient.updateStudentSubjectData({
    tools,
    competenceLevelId,
    positionOption1Id,
    positionOption2Id,
    preferredProjectId,
  })

  return response
}
