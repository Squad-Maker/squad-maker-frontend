import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { fetchCompetenceLevels } from '@/api/competence-levels'
import { createProject } from '@/api/create-project'
import { updateProject } from '@/api/update-project'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { CompetenceLevel } from '@/grpc/generated/squad/competence-level'
import { Position } from '@/grpc/generated/squad/position'
import { Project } from '@/grpc/generated/squad/project'
import { queryClient } from '@/lib/react-query'

const formSchemaTeam = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'O nome do time é obrigatório'),
  description: z.string().min(1, 'A descrição é obrigatória'),
  positions: z
    .array(
      z.object({
        id: z.string().min(1, 'O ID da posição é obrigatório'),
        count: z
          .string()
          .regex(/^\d*$/, 'A quantidade deve ser um número válido'),
      }),
    )
    .min(1, 'Pelo menos uma posição é obrigatória'),
  tools: z.array(z.string()).optional(),
  competenceLevels: z
    .array(
      z.object({
        id: z.string(),
        count: z
          .preprocess(
            (val) => (val === '' ? undefined : val),
            z.coerce.number({
              invalid_type_error: 'Valor inválido',
            }),
          )
          .refine(Number.isInteger, 'O valor deve ser um número inteiro.')
          .optional(),
      }),
    )
    .optional(),
})

type FormValuesTeam = z.infer<typeof formSchemaTeam>

interface DialogTeamProps {
  positions: Position[]
  team?: Project
  shouldClose: () => void
}

export function DialogTeam({ team, positions, shouldClose }: DialogTeamProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [competenceLevels, setCompetenceLevels] = useState<CompetenceLevel[]>(
    [],
  )

  const formTeam = useForm<FormValuesTeam>({
    resolver: zodResolver(formSchemaTeam),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      positions: [],
      tools: [],
      competenceLevels: [],
    },
  })

  useEffect(() => {
    fetchCompetenceLevels().then((res) => {
      setCompetenceLevels(res)
    })
  }, [])

  const { mutate: createProjectFn } = useMutation({
    mutationFn: async (data: FormValuesTeam) => {
      await createProject({
        name: data.name,
        description: data.description,
        positions: data.positions.map((p) => ({
          id: p.id,
          count: p.count || '0',
        })),
        tools: data.tools ?? [],
        competenceLevels: (data.competenceLevels ?? []).map((c) => ({
          id: c.id,
          count:
            typeof c.count === 'number' && !isNaN(c.count)
              ? String(c.count)
              : '0',
        })),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })

      shouldClose()

      formTeam.reset()

      toast({
        title: 'Times',
        description: 'Time gerado com sucesso!',
      })
    },
    onError: () => {
      toast({
        title: 'Ooops!',
        variant: 'destructive',
        description: 'Ocorreu um problema ao gerar o time, tente novamente.',
      })
    },
  })

  const { mutate: updateProjectFn } = useMutation({
    mutationFn: async (data: FormValuesTeam) => {
      await updateProject({
        id: data.id!,
        name: data.name,
        description: data.description,
        positions: data.positions.map((p) => ({
          id: p.id,
          count: p.count || '0',
        })),
        tools: data.tools ?? [],
        competenceLevels: (data.competenceLevels ?? []).map((c) => ({
          id: c.id,
          count:
            typeof c.count === 'number' && !isNaN(c.count)
              ? String(c.count)
              : '0',
        })),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })

      shouldClose()

      formTeam.reset()

      toast({ title: 'Time', description: 'Time atualizado com sucesso!' })
    },
    onError: (error) => {
      console.error(error)
      toast({
        title: 'Ooops!',
        variant: 'destructive',
        description: 'Ocorreu um problema ao editar o time, tente novamente.',
      })
    },
  })
  const onSubmitTeam = (data: FormValuesTeam) => {
    console.log('Enviando para o backend:', data)

    if (data.id) {
      updateProjectFn(data)
    } else {
      createProjectFn(data)
    }
  }

  useEffect(() => {
    if (team) {
      // Garante que positions seja preenchido corretamente ao editar
      const formattedPositions = positions.map((position) => {
        const positionData = team.positions.find((p) => p?.id === position.id)
        return {
          id: position.id,
          count: positionData?.count ?? '',
        }
      })

      formTeam.reset({
        id: team.id,
        name: team.name,
        description: team.description,
        positions: formattedPositions,
        tools: Array.isArray(team.tools)
          ? team.tools
          : team.tools
            ? String(team.tools)
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
        competenceLevels: team.competenceLevels
          ? team.competenceLevels.map((c) => ({
              id: c.id,
              count:
                c.count === undefined || c.count === ''
                  ? undefined
                  : Number(c.count),
            }))
          : [],
      })

      setIsEditing(true)
    }
  }, [formTeam, positions, team, setIsEditing])

  const totalPositions = formTeam
    .watch('positions')
    .reduce((acc, curr) => acc + Number(curr?.count || 0), 0)

  const isSubmitEnabled = (() => {
    const competenceLevelsValues = formTeam.watch('competenceLevels') ?? []
    const totalSeniority = competenceLevelsValues.reduce(
      (acc, v) => acc + Number(v?.count || 0),
      0,
    )
    return totalSeniority === totalPositions && !formTeam.formState.isSubmitting
  })()

  return (
    <Dialog
      open={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          formTeam.reset({
            id: '',
            name: '',
            description: '',
            positions: positions.map((p) => ({ id: p.id, count: '' })),
            competenceLevels: [],
          })
          setIsEditing(false)

          shouldClose()
        }
      }}
    >
      <DialogContent className="w-full max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar time' : 'Crie um novo time'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edite as informações do time e adicione ou remova membros'
              : 'Preencha as informações do time'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formTeam.handleSubmit(onSubmitTeam)}>
          <Form {...formTeam}>
            <div className="flex flex-col gap-4 py-2">
              <FormField
                control={formTeam.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Digite o nome do time..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={formTeam.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-none"
                        placeholder="Digite a descrição do time..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={formTeam.control}
                name="tools"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Ferramentas de domínio
                      <span
                        className="text-gray-400 cursor-help"
                        title="Aqui você pode adicionar múltiplas ferramentas do seu time. Digite o nome e pressione Enter para criar cada tag."
                      >
                        ⓘ
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2 w-full">
                        <Input
                          type="text"
                          placeholder="go, postgres, react, jira, vscode..."
                          className="w-full"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const input = e.currentTarget
                              const value = input.value.trim()
                              if (value && !field.value?.includes(value)) {
                                const updated = [...(field.value ?? []), value]
                                formTeam.setValue('tools', updated)
                                input.value = ''
                              }
                            }
                          }}
                        />
                        <div className="flex flex-wrap gap-2 w-full overflow-y-auto max-h-24 pr-2">
                          {(field.value ?? []).map(
                            (tool: string, idx: number) => (
                              <div
                                key={idx}
                                className="px-2 py-1 bg-muted rounded text-sm flex items-center gap-1 break-words"
                              >
                                {tool}
                                <button
                                  type="button"
                                  className="ml-1 text-red-500 hover:text-red-700"
                                  onClick={() => {
                                    const updated = (field.value ?? []).filter(
                                      (t: string) => t !== tool,
                                    )
                                    formTeam.setValue('tools', updated)
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                {positions.map((position) => {
                  const existingPosition = formTeam
                    .watch('positions')
                    .find((p) => p?.id === position.id) || { count: '' }

                  // Garante que a posição exista no formulário:
                  if (
                    !formTeam
                      .getValues('positions')
                      .some((p) => p.id === position.id)
                  ) {
                    const updated = [
                      ...formTeam.getValues('positions'),
                      { id: position.id, count: '' },
                    ]
                    formTeam.setValue('positions', updated)
                  }

                  return (
                    <FormField
                      key={position.id}
                      control={formTeam.control}
                      name="positions"
                      render={() => (
                        <FormItem>
                          <FormLabel>{position.name}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Quantidade de vagas..."
                              type="number"
                              value={existingPosition.count}
                              onChange={(e) => {
                                const updatedPositions = formTeam
                                  .getValues('positions')
                                  .map((p) =>
                                    p.id === position.id
                                      ? { ...p, count: e.target.value ?? '' }
                                      : p,
                                  )
                                formTeam.setValue('positions', updatedPositions)
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )
                })}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {competenceLevels.map((level, idx) => {
                  const fieldName = `competenceLevels.${idx}.count` as const
                  // Use a single getValues for competenceLevels
                  const values = formTeam.getValues('competenceLevels') ?? []
                  // Only update if not already set correctly
                  if (!(values[idx] && values[idx].id === level.id)) {
                    const newValues = [...values]
                    newValues[idx] = { id: level.id, count: undefined }
                    formTeam.setValue('competenceLevels', newValues)
                  }
                  const currentValue =
                    values[idx]?.count === undefined
                      ? ''
                      : values[idx]?.count.toString()
                  return (
                    <FormField
                      key={level.id}
                      control={formTeam.control}
                      name={fieldName}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{level.name}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={`Qtd de ${level.name}`}
                              type="number"
                              value={currentValue}
                              onChange={(e) => {
                                const value = e.target.value
                                const numberValue =
                                  value === '' ? undefined : Number(value)
                                const updated = [
                                  ...(formTeam.getValues('competenceLevels') ??
                                    []),
                                ]
                                updated[idx] = {
                                  id: level.id,
                                  count: numberValue,
                                }
                                formTeam.setValue('competenceLevels', updated, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                })
                                field.onChange(e)
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )
                })}
              </div>
              <div className="flex items-center justify-between w-full mt-4">
                <span className="flex-1 text-sm text-muted-foreground">
                  Total de vagas no time:{' '}
                  <span className="font-medium text-primary">
                    {totalPositions}
                  </span>
                </span>
                <Button type="submit" disabled={!isSubmitEnabled}>
                  {isEditing ? 'Salvar alterações' : 'Criar time'}
                </Button>
              </div>
            </div>
          </Form>
        </form>
      </DialogContent>
    </Dialog>
  )
}
