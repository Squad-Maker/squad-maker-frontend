import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { LoaderCircleIcon } from 'lucide-react'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { fetchCompetenceLevels } from '@/api/competence-levels'
import { fetchPositions } from '@/api/positions'
import { profile } from '@/api/profile'
import { fetchProjects } from '@/api/projects'
import { fetchStudentData } from '@/api/student-data'
import { updateProfile } from '@/api/update-profile'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

const formSchema = z.object({
  tools: z
    .array(z.string())
    .min(1, { message: 'Informe pelo menos uma ferramenta' }),
  competenceLevel: z.string().min(1, { message: 'Selecione uma senioridade' }),
  positionOption1: z
    .string()
    .min(1, { message: 'Selecione a primeira opção de cargo' }),
  positionOption2: z.string().nullable(),
  preferredProject: z.string().nullable(),
})

type FormValues = z.infer<typeof formSchema>

export function StudentProfile() {
  const { toast } = useToast()

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: profile,
    retry: false,
  })

  const { data: studentData, isPending: isLoading } = useQuery({
    queryKey: ['studentData'],
    queryFn: fetchStudentData,
    retry: false,
  })

  const { data: positions = [] } = useQuery({
    queryKey: ['positions'],
    queryFn: fetchPositions,
    retry: false,
  })

  const { data: competenceLevels = [] } = useQuery({
    queryKey: ['competenceLevels'],
    queryFn: fetchCompetenceLevels,
    retry: false,
  })

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    retry: false,
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tools: studentData?.tools ?? [],
      competenceLevel: studentData?.competenceLevel?.id ?? '',
      positionOption1: studentData?.positionOption1?.id ?? '',
      positionOption2: studentData?.positionOption2?.id ?? '',
      preferredProject: studentData?.preferredProject?.id ?? '',
    },
  })

  // Quando positionOption1 mudar, se for igual a positionOption2, limpar positionOption2
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'positionOption1') {
        const positionOption1 = value.positionOption1
        const positionOption2 = value.positionOption2

        if (positionOption1 && positionOption1 === positionOption2) {
          form.setValue('positionOption2', '', { shouldValidate: true })
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  const { mutate: updateProfileFn, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: FormValues) => {
      await updateProfile({
        tools: data.tools,
        competenceLevelId: data.competenceLevel,
        positionOption1Id: data.positionOption1,
        positionOption2Id: data.positionOption2 || undefined,
        preferredProjectId: data.preferredProject || undefined,
      })
    },
    onSuccess: () => {
      toast({
        title: 'Perfil',
        description: 'Seu perfil foi atualizado!',
      })
    },
    onError: () => {
      toast({
        title: 'Ooops!',
        variant: 'destructive',
        description:
          'Ocorreu um problema ao tentar atualizar seu perfil, tente novamente.',
      })
    },
  })

  const onSubmit = async (values: FormValues) => {
    updateProfileFn(values)
  }

  const selectedPosition1 = form.watch('positionOption1')

  const filteredPositionsForOption2 = positions.filter(
    (position) => position.id !== selectedPosition1,
  )

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoaderCircleIcon className="animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Helmet title="Perfil" />

      <div className="p-4 md:px-12 md:py-4">
        <h1 className="text-2xl md:text-3xl pb-2 font-semibold">Perfil</h1>
        <p className="text-muted-foreground">
          Edite seus dados para que possamos encontrar o time ideal para você!
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-8"
          >
            <section>
              <h2 className="font-semibold text-xl mb-4">
                Informações pessoais
              </h2>
              <div className="space-y-1">
                <p>{user?.name}</p>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </section>

            <section>
              <h2 className="font-semibold text-xl mb-4">Habilidades</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="tools"
                    render={({ field }) => (
                      <FormItem className="md:col-span-3">
                        <FormLabel>Ferramentas de domínio *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="VSCode, GIT, Docker, etc..."
                            value={field.value.join(', ')}
                            onChange={(e) => {
                              const value = e.target.value
                              field.onChange(
                                value
                                  ? value.split(',').map((item) => item.trim())
                                  : [],
                              )
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="competenceLevel"
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel>Senioridade *</FormLabel>
                        <Select
                          value={field.value ?? undefined}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um nível..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {competenceLevels.map((level) => (
                              <SelectItem key={level.id} value={level.id}>
                                {level.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="positionOption1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opção de cargo 1 *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma opção..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {positions.map((position) => (
                              <SelectItem key={position.id} value={position.id}>
                                {position.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="positionOption2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opção de cargo 2</FormLabel>
                        <Select
                          value={field.value ?? undefined}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger
                              onClear={
                                field.value
                                  ? () => {
                                      field.onChange('')
                                      form.trigger('positionOption2')
                                    }
                                  : undefined
                              }
                            >
                              <SelectValue placeholder="Selecione uma opção..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredPositionsForOption2.map((position) => (
                              <SelectItem key={position.id} value={position.id}>
                                {position.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="preferredProject"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>
                        Preferência por algum projeto anterior?
                      </FormLabel>
                      <Select
                        value={field.value ?? undefined}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger
                            onClear={
                              field.value
                                ? () => {
                                    field.onChange('')
                                    form.trigger('preferredProject')
                                  }
                                : undefined
                            }
                          >
                            <SelectValue placeholder="Selecione um projeto existente..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects.map((level) => (
                            <SelectItem key={level.id} value={level.id}>
                              {level.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="w-full md:w-36"
                disabled={isSubmitting}
              >
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
