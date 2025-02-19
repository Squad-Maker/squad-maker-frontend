import { EllipsisVertical, Settings, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

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
import { Project } from '@/grpc/generated/squad/project'
import { squadServiceClient } from '@/lib/api'

export function StudentProject() {
  const [projects, setProjects] = useState<Project[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [status, setStatus] = useState('loading')
  const [isOpen, setIsOpen] = useState(false)

  async function loadProjects() {
    const resp = squadServiceClient.readAllProjects({
      pagination: {
        limit: 100,
      },
    })
    setProjects((await resp).data)
  }

  useEffect(() => {
    loadProjects()
  }, [])

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
        <p className="text-3xl font-semibold">Projetos</p>

        <div className="space-y-4 p-8 ml-[1%] flex justify-around flex-wrap">
          {projects.map((project, key) => (
            <div
              key={key}
              className="border border-zinc-500 rounded-md shadow-xl dark:shadow-stone-800"
            >
              <img
                className="items-center rounded-md w-full"
                src=""
                alt="Imagem erro 404"
              />
              <div className="p-2">
                <p className="font-medium">{project.name}</p>
                <p className="font-light">{project.description}</p>
              </div>
              <div className="p-2">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical color="gray" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setOpenDialog(true)}>
                      <Settings />
                      Reavaliação
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Users />
                      Chat
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
                    {projects.map((project, key) => (
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
