import type { CreateTokenRequest } from '@/grpc/generated/auth/auth'
import { authServiceClient } from '@/lib/api'

export async function signIn({ username, password }: CreateTokenRequest) {
  const response = await authServiceClient.createToken({
    username,
    password,
  })

  return response.accessToken
}
