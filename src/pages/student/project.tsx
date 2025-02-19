import { useQuery } from '@tanstack/react-query'
import { EllipsisVertical, EyeClosed, Settings, UserPen } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { fetchStudentData } from '@/api/student-data'
import { fetchStudentProjects } from '@/api/stundent-projects'
import ModalSaving from '@/components/modal-saving'
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function StudentProject() {
  const [openDialog, setOpenDialog] = useState(false)
  const [status, setStatus] = useState('loading')
  const [isOpen, setIsOpen] = useState(false)

  const { data: studentProjects = [] } = useQuery({
    queryKey: ['studentProjects'],
    queryFn: fetchStudentProjects,
    retry: false,
  })

  const { data: studentData } = useQuery({
    queryKey: ['studentData'],
    queryFn: fetchStudentData,
    retry: false,
  })

  function onSubmit() {
    console.log('Formulário enviado:')
    setOpenDialog(false)
    setIsOpen(true)
    setStatus('loading')

    setTimeout(() => {
      setStatus('success')

      setTimeout(() => {
        setIsOpen(false)
      }, 3000)
    }, 2000)
  }

  return (
    <>
      <Helmet title="Projetos" />
      <div className="px-12 py-4">
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
          {studentProjects.map((project, key) => (
            <div
              key={key}
              className="border border-input rounded-md p-4 h-full flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium pb-4 text-xl">{project.name}</p>
                  <p>{project.description}</p>
                  <div className="mt-4">
                    <p className="font-bold text-sm">Colaboradores:</p>
                    <div className="p-2">
                      {project.students.map((student, index) => (
                        <p key={index}>
                          <span className="font-semibold">{student.name}</span>{' '}
                          - {student.positionName}
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
                    <DropdownMenuItem onClick={() => setOpenDialog(true)}>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Solicitar troca/reavaliação de time</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="cause" className="text-left font-normal">
                  Nos diga o porquê
                </Label>
                <Input
                  id="cause"
                  placeholder="O projeto não está de acordo com minhas..."
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="text-left font-normal">
                  Selecione o projeto com o qual você gostaria de colaborar
                </Label>
                <Select>
                  <SelectTrigger className="">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentProjects.map((project, key) => (
                      <SelectItem key={key} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onSubmit} type="submit">
                Enviar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {isOpen && (
        <ModalSaving
          status={status}
          messageLoad="Estamos enviando a sua solicitação"
          messageSuccess="Solicitação gerada"
        />
      )}
    </>
  )
}
