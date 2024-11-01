import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { SquareUserRound } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { signIn } from '@/api/sign-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { useToast } from '@/components/ui/use-toast'

const signInForm = z.object({
  username: z.string().min(1, { message: 'Informe o nome de usuário.' }),
  password: z.string().min(1, { message: 'Informe a senha.' }),
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  const navigate = useNavigate()

  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  async function handleSignIn({ username, password }: SignInForm) {
    try {
      const accessToken = await authenticate({ username, password })

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken)

        return navigate('/', { replace: true })
      }
    } catch {
      return toast({
        variant: 'destructive',
        title: 'Acessar',
        description: 'Usuário ou senha inválidos.',
      })
    }
  }

  return (
    <>
      <Helmet title="Entrar" />

      <div className="p-8">
        <div className="flex w-[400px] flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <SquareUserRound className="size-8 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Acessar</h1>
            <p className="text-sm text-muted-foreground">
              Gerenciador de equipes
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input id="username" type="text" {...register('username')} />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <PasswordInput id="password" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              Entrar
            </Button>
            <div className="space-y-4 pt-4 text-muted-foreground text-sm">
              <p>
                Acadêmicos: insira no campo de usuário a letra{' '}
                <strong>&quot;a&quot;</strong> seguido do seu número de RA. (ex:
                a1234567) e utilize a mesma senha do sistema acadêmico.
              </p>
              <p>
                Servidores: informe seu nome de usuário e senha já utilizados
                nos sistemas da UTFPR.
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
