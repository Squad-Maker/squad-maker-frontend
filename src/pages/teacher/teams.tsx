import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Code, Flame, Laptop, Pen, Plus, Trash } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { addStudentToTeam } from '@/api/add-student-to-team'
import { deleteProject } from '@/api/delete-project'
import { generateAllTeams } from '@/api/genereted-all-project'
import { generatedProject } from '@/api/genereted-project'
import { fetchPositions } from '@/api/positions'
import { fetchProjects } from '@/api/projects'
import { fetchAllStudents } from '@/api/read-all-students'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { TeamGeneratorType } from '@/grpc/generated/squad/enum'
import type {
  Project,
  Project_Student as ProjectStudent,
} from '@/grpc/generated/squad/project'
import { queryClient } from '@/lib/react-query'

import { DialogTeam } from './dialog-team'

const formSchemaStudent = z.object({
  projectId: z.string(),
  studentId: z.string(),
  positionId: z.string().min(1, 'Selecione um cargo válido'),
})

type FormValuesStudent = z.infer<typeof formSchemaStudent>

export function TeacherTeams() {
  const { toast } = useToast()

  const [selectedStudent, setSelectedStudent] = useState<ProjectStudent | null>(
    null,
  )
  const [teamEditing, setTeamEditing] = useState<Project>()
  const [openDialogTeam, setOpenDialogTeam] = useState<boolean>(false)
  const [openDialogStudent, setOpenDialogStudent] = useState<boolean>(false)
  const [openDialogAddStudent, setOpenDialogAddStudent] =
    useState<boolean>(false)

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchProjects,
    retry: false,
  })

  const { data: positions = [], isPending: isPositionsPending } = useQuery({
    queryKey: ['positions'],
    queryFn: fetchPositions,
    retry: false,
  })

  const formStudent = useForm<FormValuesStudent>({
    resolver: zodResolver(formSchemaStudent),
    defaultValues: {
      projectId: '',
      studentId: '',
      positionId: '',
    },
  })

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: () =>
      fetchAllStudents(/* {
        simple: {
          filterKey: 'inProject',
          value: 'false',
          operator: 0,
        },
      } */),
    retry: false,
  })

  const { mutate: generatedProjectFn } = useMutation({
    mutationFn: async (projectId?: string) => {
      await generatedProject({
        projectId,
        generatorType: TeamGeneratorType.tgtDefault,
      })
    },
    onSuccess: () => {
      toast({
        title: 'Times',
        description: 'Time gerado com sucesso!',
      })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
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
      queryClient.invalidateQueries({ queryKey: ['students'] })

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
      queryClient.invalidateQueries({ queryKey: ['students'] })

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

      formStudent.reset()

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

  const { mutate: deleteProjectFn } = useMutation({
    mutationFn: async (id: string) => {
      await deleteProject({
        id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })

      setOpenDialogStudent(false)

      toast({
        title: 'Times',
        description: 'Time excluído com sucesso!',
      })
    },
    onError: () => {
      toast({
        title: 'Ooops!',
        variant: 'destructive',
        description: 'Ocorreu um problema ao excluir o time, tente novamente.',
      })
    },
  })

  const onUpdateStudent = (data: FormValuesStudent) => {
    updateStudentFn(data)
  }

  const onAddStudent = (data: FormValuesStudent) => {
    addStudentFromTeamFn(data)
  }

  return (
    <>
      <Helmet title="Gestão de times" />

      <div className="p-4 md:px-12 md:py-4">
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl pb-2 font-semibold">
              Gestão de times
            </h1>
            <p className="text-muted-foreground">
              Crie e gerencie seus times e membros
            </p>
          </div>

          <Button
            size="lg"
            className="gap-2"
            onClick={() => {
              setTeamEditing(undefined)
              setOpenDialogTeam(true)
            }}
          >
            <Plus className="size-4" /> Novo time
          </Button>
          {!isPositionsPending && openDialogTeam && (
            <DialogTeam
              team={teamEditing}
              positions={positions}
              shouldClose={() => {
                setTeamEditing(undefined)
                setOpenDialogTeam(false)
              }}
            />
          )}
        </div>
        <div className="py-6">
          <div>
            {teams.length ? (
              teams.map((team) => (
                <Accordion key={team.id} type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full">
                        <span>{team.name}</span>
                        <div className="flex gap-1 mr-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation()

                              setTeamEditing(team)
                              setOpenDialogTeam(true)
                            }}
                          >
                            <Pen className="size-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                <Trash className="size-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Deseja excluir o time?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteProjectFn(team.id)}
                                >
                                  Confirmar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent>
                      <p>{team.description}</p>
                      <div className="mt-4">
                        <p className="font-medium">Colaboradores:</p>
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
                                      setOpenDialogStudent(isOpen)

                                      if (!isOpen) {
                                        setSelectedStudent(null)
                                      }
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
                                    <DialogContent className="lg:min-w-[600px] overflow-auto">
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
                                                    studentId:
                                                      selectedStudent.id,
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
                                                    onValueChange={
                                                      field.onChange
                                                    }
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
                                                              projectId:
                                                                team.id,
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
                                • {student.positionName}{' '}
                                {student.competenceLevelName}
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

                            if (!isOpen) {
                              formStudent.reset()
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline">Adicionar aluno</Button>
                          </DialogTrigger>
                          <DialogContent className="lg:min-w-[600px] overflow-auto">
                            <DialogHeader>
                              <DialogTitle>{team.name}</DialogTitle>
                              <DialogDescription>
                                Selecione um aluno e um cargo para adicionar ao
                                time.
                              </DialogDescription>
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
                                  className="flex flex-col gap-4 py-2"
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
                                  <DialogFooter className="mt-4">
                                    <Button type="submit">Adicionar</Button>
                                  </DialogFooter>
                                </form>
                              </Form>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          onClick={() => generatedProjectFn(team.id)}
                        >
                          Preencher automaticamente
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Code className="w-16 h-16 text-muted-foreground" />
                <p className="text-muted-foreground text-lg ml-4">
                  Nenhum time cadastrado
                </p>
              </div>
            )}
            <div className="flex mt-4 justify-end">
              {teams.length ? (
                <div className="my-3">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="lg" variant="secondary">
                        <Flame className="size-4 text-orange-500 mr-2" />
                        <span className="flex items-center ">
                          Gerar todos os times automaticamente
                        </span>
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
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
