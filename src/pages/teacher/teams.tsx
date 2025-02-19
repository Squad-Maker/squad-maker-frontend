import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { createProject } from '@/api/create-project'
import { generatedProject } from '@/api/genereted-project'
import { fetchPositions } from '@/api/positions'
import { fetchProjects } from '@/api/projects'
import ModalSaving from '@/components/modal-saving'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { queryClient } from '@/lib/react-query'

const formSchema = z.object({
  name: z.string().min(1, 'O nome do time é obrigatório'),
  description: z.string().min(1, 'O jogador é obrigatório'),
  positions: z
    .array(
      z.object({
        id: z.string().min(1, 'O ID da posição é obrigatório'),
        count: z
          .string()
          .regex(/^\d+$/, 'A quantidade deve ser um número válido'),
      }),
    )
    .min(1, 'Pelo menos uma posição é obrigatória'),
})

type FormValues = z.infer<typeof formSchema>

export function Teams() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState('loading')

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchProjects,
    retry: false,
  })

  const { data: positions = [] } = useQuery({
    queryKey: ['positions'],
    queryFn: fetchPositions,
    retry: false,
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      positions: [],
    },
    mode: 'onChange',
    shouldUnregister: false,
  })

  const { mutate: createProjectFn } = useMutation({
    mutationFn: async (data: FormValues) => {
      try {
        const response = await createProject({
          name: data.name,
          description: data.description,
          positions: data.positions,
        })
        return response
      } catch (error) {
        console.error('Error updating profile:', error)
        throw error
      }
    },
    onSuccess: () => {
      setStatus('success')
      setTimeout(() => setIsOpen(false), 2000)
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
    onError: () => {
      setStatus('error')
      setTimeout(() => setIsOpen(false), 2000)
    },
  })

  const onSubmit = (data: FormValues) => {
    createProjectFn(data)
    setModalIsOpen(false)
  }

  const { mutate: generatedProjectFn } = useMutation({
    mutationFn: async (projectId?: string) => {
      try {
        const response = await generatedProject({
          projectId,
        })
        return response
      } catch (error) {
        console.error('Error updating profile:', error)
        throw error
      }
    },
    onSuccess: () => {
      setStatus('success')
      setTimeout(() => setIsOpen(false), 2000)
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
    onError: () => {
      setStatus('error')
      setTimeout(() => setIsOpen(false), 2000)
    },
  })

  return (
    <>
      <Helmet title="Gestão de times" />

      <div className="p-8">
        <h1 className="text-2xl md:text-3xl pb-2 font-semibold">
          Gestão de times
        </h1>
        <div className="border rounded-xl p-6">
          {teams.map((team, key) => (
            <Accordion key={key} type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>{team.name}</AccordionTrigger>
                <AccordionContent>
                  <p className="font-light">{team.description}</p>
                  <div className="mt-4">
                    <p className="font-bold">Colaboradores:</p>
                    <div className="p-2">
                      {team.students.map((student, key) => (
                        <p key={key}>
                          <span className="font-semibold">{student.name}</span>{' '}
                          - {student.positionName}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button>Adicionar aluno</Button>
                    <Button onClick={() => generatedProjectFn(team.id)}>
                      Preencher automaticamente
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
          <div className="flex mt-4 justify-end">
            <Button onClick={() => setModalIsOpen(true)}>+ Novo time</Button>
            {modalIsOpen && (
              <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
                <DialogTrigger></DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crie um novo time</DialogTitle>
                    <DialogDescription>
                      Crie um time de um projeto já existente para que os alunos
                      consigam seleciona-los em seu cadastro
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-4 py-4"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="SquadMaker" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Projeto para gerenciar times..."
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        {positions.map((position) => (
                          <FormField
                            key={position.id}
                            control={form.control}
                            name="positions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{position.name}</FormLabel>
                                <FormControl>
                                  <Input
                                    min="1"
                                    onChange={(e) => {
                                      const value =
                                        parseInt(e.target.value, 10) || 0
                                      form.setValue('positions', [
                                        ...field.value.filter(
                                          (p) => p.id !== position.id,
                                        ),
                                        {
                                          id: position.id,
                                          count: String(value),
                                        },
                                      ])
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <DialogFooter>
                        <Button type="submit">Criar novo time</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        {isOpen && (
          <ModalSaving
            status={status}
            messageLoad="Salvando..."
            messageSuccess="Salvo com sucesso!"
          />
        )}
      </div>
    </>
  )
}
