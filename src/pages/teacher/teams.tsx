import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Code, Laptop, Plus } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { addStudentToTeam } from '@/api/add-student-to-team'
import { createProject } from '@/api/create-project'
import { generateAllTeams } from '@/api/genereted-all-project'
import { generatedProject } from '@/api/genereted-project'
import { fetchPositions } from '@/api/positions'
import { fetchProjects } from '@/api/projects'
import { fetchAllStudent } from '@/api/read-all-students'
import { removeStudentFromTeam } from '@/api/remove-student-from-team'
import { updatePositionStudent } from '@/api/update-position-student'
import { SingleSelect } from '@/components/single-select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import type { Project_Student as ProjectStudent } from '@/grpc/generated/squad/project'
import { queryClient } from '@/lib/react-query'

export function TeacherTeams() {
  const formSchemaTeam = z.object({
    name: z.string().min(1, 'O nome do time é obrigatório'),
    description: z.string().min(1, 'A descrição é obrigatória'),
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

  const formSchemaStudent = z.object({
    projectId: z.string(),
    studentId: z.string(),
    positionId: z.string().min(1, 'Selecione um cargo válido'),
  })

  type FormValuesTeam = z.infer<typeof formSchemaTeam>

  type FormValuesStudent = z.infer<typeof formSchemaStudent>

  const { toast } = useToast()

  const [selectedStudent, setSelectedStudent] = useState<ProjectStudent | null>(
    null,
  )

  const [openDialogTeam, setOpenDialogTeam] = useState(false)
  const [openDialogStudent, setOpenDialogStudent] = useState(false)
  const [openDialogAddStudent, setOpenDialogAddStudent] = useState(false)

  const formTeam = useForm<FormValuesTeam>({
    resolver: zodResolver(formSchemaTeam),
    defaultValues: {
      name: '',
      description: '',
      positions: [],
    },
  })

  const formStudent = useForm<FormValuesStudent>({
    resolver: zodResolver(formSchemaStudent),
    defaultValues: {
      projectId: '',
      studentId: '',
      positionId: '',
    },
  })

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

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: fetchAllStudent,
    retry: false,
  })

  const { mutate: createProjectFn } = useMutation({
    mutationFn: async (data: FormValuesTeam) => {
      await createProject({
        name: data.name,
        description: data.description,
        positions: data.positions,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })

      setOpenDialogTeam(false)

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

  const { mutate: generatedProjectFn } = useMutation({
    mutationFn: async (projectId?: string) => {
      await generatedProject({
        projectId,
      })
    },
    onSuccess: () => {
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

  const { mutate: generateAllTeamsFn } = useMutation({
    mutationFn: async () => {
      await generateAllTeams()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })

      toast({
        title: 'Times',
        description: 'Times gerados com sucesso!',
      })
    },
    onError: () => {
      toast({
        title: 'Ooops!',
        variant: 'destructive',
        description: 'Ocorreu um problema ao gerar os times, tente novamente.',
      })
    },
  })

  const { mutate: updateStudentFn } = useMutation({
    mutationFn: async (student: FormValuesStudent) => {
      await updatePositionStudent(student)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })

      setOpenDialogStudent(false)

      toast({
        title: 'Times',
        description: 'Aluno atualizado com sucesso!',
      })
    },
    onError: () => {
      toast({
        title: 'Ooops!',
        variant: 'destructive',
        description:
          'Ocorreu um problema ao atualizar o aluno, tente novamente.',
      })
    },
  })

  const { mutate: removeStudentFromTeamFn } = useMutation({
    mutationFn: async ({
      projectId,
      studentId,
    }: {
      projectId: string
      studentId: string
    }) => {
      await removeStudentFromTeam({
        projectId,
        studentId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })

      setOpenDialogStudent(false)

      toast({
        title: 'Times',
        description: 'Aluno removido com sucesso!',
      })
    },
    onError: () => {
      toast({
        title: 'Ooops!',
        variant: 'destructive',
        description: 'Ocorreu um problema ao remover o aluno, tente novamente.',
      })
    },
  })

  const { mutate: addStudentFromTeamFn } = useMutation({
    mutationFn: async (student: FormValuesStudent) => {
      await addStudentToTeam(student)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      queryClient.invalidateQueries({ queryKey: ['students'] })

      setOpenDialogAddStudent(false)

      toast({
        title: 'Times',
        description: 'Aluno adicionado com sucesso!',
      })
    },
    onError: () => {
      toast({
        title: 'Ooops!',
        variant: 'destructive',
        description:
          'Ocorreu um problema ao adicionar o aluno, tente novamente.',
      })
    },
  })

  const onSubmitTeam = (data: FormValuesTeam) => {
    createProjectFn(data)
  }

  const onUpdateStudent = (data: FormValuesStudent) => {
    updateStudentFn(data)
  }

  const onAddStudent = (data: FormValuesStudent) => {
    addStudentFromTeamFn(data)
  }

  const totalVagas = formTeam
    .watch('positions')
    .reduce((acc, curr) => acc + Number(curr.count || 0), 0)

  return (
    <>
      <Helmet title="Gestão de times" />
      <div className="p-4 md:px-12 md:py-4">
        <h1 className="text-2xl md:text-3xl pb-2 font-semibold">
          Gestão de times
        </h1>

        <p className="text-muted-foreground">Crie e gerencie seus times</p>

        <div className="py-8">
          <div className="border rounded-xl py-2 px-6">
            {teams.map((team) => (
              <Accordion key={team.id} type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>{team.name}</AccordionTrigger>
                  <AccordionContent>
                    <p className="font-light">{team.description}</p>
                    <div className="mt-4">
                      <p className="font-bold">Colaboradores:</p>
                      <div className="py-2">
                        {team.students.length === 0 ? (
                          <p className="text-muted-foreground">
                            Nenhum aluno adicionado
                          </p>
                        ) : (
                          team.students.map((student) => (
                            <p key={student.id}>
                              <span className="font-medium text-base underline">
                                <Dialog
                                  open={openDialogStudent}
                                  onOpenChange={(isOpen) => {
                                    if (!isOpen) {
                                      setSelectedStudent(null)
                                    }
                                    setOpenDialogStudent(isOpen)
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      className="-px-0"
                                      size="sm"
                                      variant="link"
                                      onClick={() => {
                                        setSelectedStudent(student)
                                        formStudent.setValue(
                                          'positionId',
                                          student.positionId || '',
                                        )
                                      }}
                                    >
                                      {student.name}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="min-w-[500px] overflow-auto">
                                    <DialogHeader>
                                      <DialogTitle>
                                        {selectedStudent?.name}
                                      </DialogTitle>
                                      <DialogDescription>
                                        {selectedStudent?.email}
                                      </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-2">
                                      <span className="flex gap-3 flex-row items-center break-words">
                                        <Code className="size-6" />{' '}
                                        {String(selectedStudent?.tools)
                                          .split(',')
                                          .join(', ')}
                                      </span>
                                      <span className="flex gap-3 flex-row items-center">
                                        <Laptop className="size-6" />{' '}
                                        {selectedStudent?.competenceLevelName}
                                      </span>

                                      <Form {...formStudent}>
                                        <form
                                          onSubmit={formStudent.handleSubmit(
                                            (data) => {
                                              if (selectedStudent?.id) {
                                                const updatedData = {
                                                  ...data,
                                                  projectId: team.id,
                                                  studentId: selectedStudent.id,
                                                }
                                                onUpdateStudent(updatedData)
                                              }
                                            },
                                          )}
                                          className="py-4"
                                        >
                                          <FormField
                                            control={formStudent.control}
                                            name="positionId"
                                            render={({ field }) => (
                                              <FormItem className="md:col-span-1">
                                                <FormLabel>Cargo</FormLabel>
                                                <Select
                                                  value={field.value}
                                                  onValueChange={field.onChange}
                                                >
                                                  <FormControl>
                                                    <SelectTrigger>
                                                      <SelectValue placeholder="Selecione um cargo..." />
                                                    </SelectTrigger>
                                                  </FormControl>
                                                  <SelectContent>
                                                    {positions.map(
                                                      (position) => (
                                                        <SelectItem
                                                          key={position.id}
                                                          value={position.id}
                                                        >
                                                          {position.name}
                                                        </SelectItem>
                                                      ),
                                                    )}
                                                  </SelectContent>
                                                </Select>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <DialogFooter className="-mb-4 mt-8">
                                            <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                <Button variant="destructive">
                                                  Excluir
                                                </Button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                <AlertDialogHeader>
                                                  <AlertDialogTitle>
                                                    Deseja excluir o aluno do
                                                    time?
                                                  </AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    Esta ação não pode ser
                                                    desfeita.
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                  <AlertDialogCancel>
                                                    Cancelar
                                                  </AlertDialogCancel>
                                                  <AlertDialogAction
                                                    onClick={formStudent.handleSubmit(
                                                      () => {
                                                        if (
                                                          selectedStudent?.id
                                                        ) {
                                                          const student = {
                                                            projectId: team.id,
                                                            studentId:
                                                              selectedStudent.id,
                                                          }
                                                          removeStudentFromTeamFn(
                                                            student,
                                                          )
                                                        }
                                                      },
                                                    )}
                                                  >
                                                    Confirmar
                                                  </AlertDialogAction>
                                                </AlertDialogFooter>
                                              </AlertDialogContent>
                                            </AlertDialog>

                                            <Button type="submit">
                                              Salvar
                                            </Button>
                                          </DialogFooter>
                                        </form>
                                      </Form>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </span>{' '}
                              • {student.positionName}
                            </p>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Dialog
                        open={openDialogAddStudent}
                        onOpenChange={(isOpen) => {
                          setOpenDialogAddStudent(isOpen)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="secondary">Adicionar aluno</Button>
                        </DialogTrigger>
                        <DialogContent className="min-w-[500px] overflow-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Adicione um aluno ao time {team.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2">
                            <Form {...formStudent}>
                              <form
                                onSubmit={formStudent.handleSubmit((data) => {
                                  const updatedData = {
                                    ...data,
                                    projectId: team.id,
                                  }
                                  onAddStudent(updatedData)
                                })}
                                className="py-4"
                              >
                                <FormField
                                  control={formStudent.control}
                                  name="studentId"
                                  render={({ field }) => (
                                    <FormItem className="md:col-span-1">
                                      <FormLabel>Aluno</FormLabel>
                                      <SingleSelect
                                        students={students}
                                        onChange={(studentId) =>
                                          field.onChange(studentId)
                                        }
                                        value={field.value}
                                      />
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={formStudent.control}
                                  name="positionId"
                                  render={({ field }) => (
                                    <FormItem className="md:col-span-1">
                                      <FormLabel>Cargo</FormLabel>
                                      <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Selecione um cargo..." />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {positions.map((position) => (
                                            <SelectItem
                                              key={position.id}
                                              value={position.id}
                                            >
                                              {position.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <DialogFooter className="-mb-4 mt-8">
                                  <Button type="submit">Adicionar</Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button onClick={() => generatedProjectFn(team.id)}>
                        Preencher automaticamente
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
            <div className="flex mt-4 justify-end">
              <div className="my-3 pr-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="lg" variant="secondary">
                      Gerar todos os times automaticamente
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Deseja gerar todos os times automaticamente?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação atribuirá os alunos aos seus respectivos
                        times.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => generateAllTeamsFn()}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <Dialog
                open={openDialogTeam}
                onOpenChange={(isOpen) => {
                  setOpenDialogTeam(isOpen)

                  if (!isOpen) {
                    formTeam.reset()
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2 my-3">
                    <Plus className="size-4" /> Novo time
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crie um novo time</DialogTitle>
                    <DialogDescription>
                      Crie um time de um projeto já existente para que os alunos
                      consigam seleciona-los em seu cadastro
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...formTeam}>
                    <form
                      onSubmit={formTeam.handleSubmit(onSubmitTeam)}
                      className="flex flex-col gap-4 py-2"
                    >
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
                      <div className="grid grid-cols-2 gap-4">
                        {positions.map((position) => (
                          <FormField
                            key={position.id}
                            control={formTeam.control}
                            name="positions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{position.name}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Quantidade de vagas..."
                                    type="number"
                                    min="1"
                                    onChange={(e) => {
                                      const value =
                                        Number.parseInt(e.target.value, 10) || 0
                                      formTeam.setValue('positions', [
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
                      <DialogFooter className="flex items-center justify-between w-full mt-4">
                        <span className="flex-1 text-sm text-muted-foreground">
                          Total de vagas no time:{' '}
                          <span className="font-medium text-primary">
                            {totalVagas}
                          </span>
                        </span>
                        <Button type="submit">Criar novo time</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
