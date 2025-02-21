import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { LoaderCircleIcon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { profile } from '@/api/profile'
import { signIn } from '@/api/sign-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { useToast } from '@/components/ui/use-toast'

const signInForm = z.object({
  username: z.string().min(1, { message: 'Informe o nome de usuário.' }),
  password: z.string().min(1, { message: 'Informe a senha.' }),
  keepConnected: z.boolean().default(true),
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

  const { mutateAsync: me } = useMutation({
    mutationFn: profile,
    onSuccess: (profile) => {
      if (profile?.type === 1) {
        return navigate('/teacher', { replace: true })
      }
      if (profile?.type === 2) {
        return navigate('/student', { replace: true })
      }
    },
  })

  async function handleSignIn({
    username,
    password,
    keepConnected,
  }: SignInForm) {
    try {
      const accessToken = await authenticate({
        username,
        password,
        keepConnected,
      })

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken)

        me()
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
        <div className="flex w-[350px] flex-col gap-6">
          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="space-y-2 mb-4">
              <h1 className="text-3xl text-center font-semibold">
                Seja bem-vindo!
              </h1>
              <p className="text-muted-foreground text-center text-sm">
                Entre com seus dados para acessar sua conta.
              </p>
            </div>
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
              {isSubmitting ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                'Entrar'
              )}
            </Button>
            <div className="space-y-4 pt-4 text-muted-foreground text-sm">
              <p>
                <strong>Acadêmicos:</strong> insira no campo de usuário a letra{' '}
                <strong>&quot;a&quot;</strong> seguido do seu número de RA. (ex:
                a1234567) e utilize a mesma senha do sistema acadêmico.
              </p>
              <p>
                <strong>Servidores:</strong> informe seu nome de usuário e senha
                já utilizados nos sistemas da UTFPR.
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
