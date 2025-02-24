import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { createProject } from '@/api/create-project'
import { updateProject } from '@/api/update-project'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

  const formTeam = useForm<FormValuesTeam>({
    resolver: zodResolver(formSchemaTeam),
    defaultValues: {
      name: '',
      description: '',
      positions: positions.map((p) => ({ id: p.id, count: '' })),
    },
  })

  const { mutate: createProjectFn } = useMutation({
    mutationFn: async (data: FormValuesTeam) => {
      await createProject({
        name: data.name,
        description: data.description,
        positions: data.positions.map((p) => ({
          id: p.id,
          count: p.count || '0',
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
    console.log(data)
    if (data.id) {
      updateProjectFn(data)
    } else {
      createProjectFn(data)
    }
  }

  useEffect(() => {
    if (team) {
      const formattedPositions = positions.map((position) => {
        const positionData = team.positions.find((p) => p?.id === position.id)
        return {
          id: position.id,
          count: positionData?.count ?? '',
        }
      })

      formTeam.setValue('id', team.id)
      formTeam.setValue('name', team.name)
      formTeam.setValue('description', team.description)
      formTeam.setValue('positions', formattedPositions)

      setIsEditing(true)
    }
  }, [formTeam, positions, team, setIsEditing])

  const totalPositions = formTeam
    .watch('positions')
    .reduce((acc, curr) => acc + Number(curr?.count || 0), 0)

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
          })
          setIsEditing(false)

          shouldClose()
        }
      }}
    >
      <DialogContent className="lg:min-w-[600px]">
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
        <Form {...formTeam}>
          <div className="flex flex-col gap-4 py-2">
            <FormField
              control={formTeam.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite o nome do time..." />
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
            <div className="grid grid-cols-2 gap-4">
              {positions.map((position, index) => {
                const existingPosition = formTeam
                  .watch('positions')
                  .find((p) => p?.id === position.id) || { count: '' }

                return (
                  <FormField
                    key={position.id}
                    control={formTeam.control}
                    name={`positions.${index}`}
                    render={() => (
                      <FormItem>
                        <FormLabel>{position.name}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Quantidade de vagas..."
                            type="number"
                            value={existingPosition.count}
                            onChange={(e) => {
                              const updatedPositions =
                                formTeam.getValues('positions')
                              const formPosition = updatedPositions.find(
                                (p) => p?.id === position.id,
                              )
                              if (formPosition) {
                                formPosition.count = e.target.value ?? ''
                              } else {
                                updatedPositions.push({
                                  id: position.id,
                                  count: e.target.value,
                                })
                              }

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
            <DialogFooter className="flex items-center justify-between w-full mt-4">
              <span className="flex-1 text-sm text-muted-foreground">
                Total de vagas no time:{' '}
                <span className="font-medium text-primary">
                  {totalPositions}
                </span>
              </span>
              <Button
                type="button"
                onClick={() => {
                  formTeam.handleSubmit(onSubmitTeam)()
                }}
              >
                {isEditing ? 'Salvar alterações' : 'Criar time'}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
