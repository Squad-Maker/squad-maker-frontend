import { authServiceClient } from '@/lib/api'

export interface SignInBody {
  username: string
  password: string
}

export async function signIn({ username, password }: SignInBody) {
  const response = await authServiceClient.createToken({
    username,
    password,
  })

  return response.accessToken
}
