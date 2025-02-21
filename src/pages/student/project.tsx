import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose, DialogDescription } from '@radix-ui/react-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  EllipsisVertical,
  EyeClosed,
  LoaderCircleIcon,
  Settings,
  UserPen,
} from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import { fetchProjects } from '@/api/projects'
import { requestTeamRevaluation } from '@/api/request-team-revaluation'
import { fetchStudentData } from '@/api/student-data'
import { fetchStudentProjects } from '@/api/stundent-projects'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import type { Project } from '@/grpc/generated/squad/project'
import { queryClient } from '@/lib/react-query'

const formSchema = z.object({
  projectId: z.string(),
  reason: z.string().min(1, { message: 'Informe o motivo' }),
  desiredProjectId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function StudentProject() {
  const { toast } = useToast()

  const [openDialog, setOpenDialog] = useState(false)

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: '',
      reason: '',
      desiredProjectId: '',
    },
  })

  const { data: studentProjects = [] } = useQuery({
    queryKey: ['studentProjects'],
    queryFn: fetchStudentProjects,
    retry: false,
  })

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchProjects,
    retry: false,
  })

  const { data: studentData, isPending: isLoading } = useQuery({
    queryKey: ['studentData'],
    queryFn: fetchStudentData,
    retry: false,
  })

  const { mutate: requestTeamRevaluationFn } = useMutation({
    mutationFn: async (data: FormValues) => {
      await requestTeamRevaluation({
        projectId: data.projectId,
        reason: data.reason,
        desiredProjectId: data.desiredProjectId || undefined,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentProjects'] })

      setOpenDialog(false)

      toast({
        title: 'Reavaliação',
        description: 'Formulário enviado! Aguarde o contato do professor.',
      })
    },
    onError: () => {
      toast({
        title: 'Ooops!',
        variant: 'destructive',
        description:
          'Ocorreu um problema ao tentar enviar o formulário, tente novamente.',
      })
    },
  })

  const onSubmit = async (values: FormValues) => {
    requestTeamRevaluationFn(values)
  }

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoaderCircleIcon className="animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Helmet title="Projetos" />

      <div className="p-4 md:px-12 md:py-4">
        <h1 className="text-2xl md:text-3xl pb-2 font-semibold">Projetos</h1>
        <p className="text-muted-foreground">
          Aqui você pode visualizar os projetos disponíveis para colaborar
        </p>

        {!studentData?.hadFirstUpdate ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <UserPen className="w-16 h-16 text-muted-foreground" />
              <p className="text-muted-foreground text-lg mt-4 text-center">
                Você precisa atualizar seu perfil para poder participar de um
                projeto
              </p>
              <Button className="mt-4">
                <Link to="/student/profile">Atualizar perfil</Link>
              </Button>
            </div>
          </div>
        ) : (
          !studentProjects.length && (
            <div className="absolute inset-0 flex items-center justify-center">
              <EyeClosed className="w-16 h-16 text-muted-foreground" />
              <p className="text-muted-foreground text-lg ml-4">
                Você ainda não está em nenhum projeto
              </p>
            </div>
          )
        )}

        <div className="grid grid-cols-2 gap-4 py-8">
          {studentProjects.map((project) => (
            <div
              key={project.id}
              className="border border-input rounded-md p-4 h-full flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium pb-4 text-xl">{project.name}</p>
                  <p>{project.description}</p>
                  <div className="mt-4">
                    <p className="font-bold text-sm">Colaboradores:</p>
                    <div className="py-2">
                      {project.students.map((student) => (
                        <p key={student.id}>
                          <span className="font-medium text-base">
                            {student.name}
                          </span>{' '}
                          • {student.positionName}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <EllipsisVertical className="text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setOpenDialog(true)
                        setSelectedProject(project)
                      }}
                    >
                      <Settings />
                      Reavaliação
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="lg:min-w-[500px] overflow-auto">
            <DialogHeader>
              <DialogTitle>Solicitar troca/reavaliação de time</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Se você deseja trocar de time ou reavaliar sua posição, preencha
                o formulário abaixo
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((data) => {
                      if (selectedProject?.id) {
                        const updatedData = {
                          ...data,
                          projectId: selectedProject?.id,
                        }
                        onSubmit(updatedData)
                      }
                    })}
                    className="flex flex-col gap-4 py-2"
                  >
                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nos diga o porquê</FormLabel>
                          <FormControl>
                            <Textarea
                              className="min-h-40 resize-none"
                              {...field}
                              placeholder="Descreva..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="desiredProjectId"
                      render={({ field }) => (
                        <FormItem className="md:col-span-1">
                          <FormLabel>
                            Qual projeto você gostaria de colaborar?
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {teams.map((team) => (
                                <SelectItem key={team.id} value={team.id}>
                                  {team.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 -mb-4 mt-4">
                      <DialogClose>
                        <Button variant="outline" className="w-full sm:w-auto">
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button type="submit" className="w-full sm:w-auto">
                        Enviar
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
