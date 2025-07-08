import { TeamGeneratorType } from '@/grpc/generated/squad/enum'
import { squadServiceClient } from '@/lib/api'

export async function generateAllTeams() {
  const response = await squadServiceClient.generateAllTeams({
    generatorType: TeamGeneratorType.tgtGeneticAlgorithm,
  })

  return response
}
