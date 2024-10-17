import { Info } from 'lucide-react'

import { Header } from '@/components/header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import MultipleSelector from '@/components/ui/multiple-selector'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const positions = [
  {
    value: 'frontend',
    label: 'Front-end',
  },
  {
    value: 'backend',
    label: 'Back-end',
  },
  {
    value: 'fullstack',
    label: 'Fullstack',
  },
  {
    value: 'qa',
    label: 'QA',
  },
  {
    value: 'uiux',
    label: 'UI/UX',
  },
  {
    value: 'pm',
    label: 'Project Manager',
  },
]

const alternativePositions = [
  {
    value: 'frontend',
    label: 'Front-end',
  },
  {
    value: 'backend',
    label: 'Back-end',
  },
  {
    value: 'fullstack',
    label: 'Fullstack',
  },
  {
    value: 'qa',
    label: 'QA',
  },
  {
    value: 'uiux',
    label: 'UI/UX',
  },
  {
    value: 'pm',
    label: 'Project Manager',
  },
]

const seniority = [
  {
    value: 'jr',
    label: 'Júnior',
  },
  {
    value: 'pl',
    label: 'Pleno',
  },
  {
    value: 'sr',
    label: 'Sênior',
  },
]

const alternativeSeniority = [
  {
    value: 'jr',
    label: 'Júnior',
  },
  {
    value: 'pl',
    label: 'Pleno',
  },
  {
    value: 'sr',
    label: 'Sênior',
  },
]

const projects = [
  {
    value: 'projeto1',
    label: 'Projeto 1',
  },
  {
    value: 'projeto2',
    label: 'Projeto 2',
  },
  {
    value: 'projeto3',
    label: 'Projeto 3',
  },
  {
    value: 'projeto4',
    label: 'Projeto 4',
  },
  {
    value: 'projeto5',
    label: 'Projeto 5',
  },
]

export function StudentForm() {
  return (
    <>
      <Header />
      <div className="lg:px-40 xl:px-60">
        <div className="p-8 text-center">
          <h1 className="text-lg font-semibold">
            Fábrica de Software - {new Date().getFullYear()}
          </h1>
          <p>Preencha o formulário para formarmos o grupo ideal para você</p>
        </div>

        <form className="space-y-4 px-8 lg:px-20">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="w-full space-y-1">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" type="text" value="Pedro Henrique" disabled />
            </div>
            <div className="w-full space-y-1">
              <Label htmlFor="name">E-mail</Label>
              <Input id="name" type="text" value="email@example.com" disabled />
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="w-full space-y-1">
              <Select>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Label
                        className="flex flex-row items-center gap-1.5"
                        htmlFor="position"
                      >
                        Cargo desejável
                        <Info className="size-4" />
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent className="font-normal">
                      O cargo desejável é a função que você deseja exercer no
                      projeto.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cargo..." />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position.value} value={position.value}>
                      {position.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full space-y-1">
              <Select>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Label
                        className="flex flex-row items-center gap-1.5"
                        htmlFor="seniority"
                      >
                        Senioridade
                        <Info className="size-4" />
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent className="font-normal">
                      Sua senioridade é o nível de experiência que você possui
                      na área.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <SelectTrigger>
                  <SelectValue placeholder="Selecione um nível..." />
                </SelectTrigger>
                <SelectContent>
                  {seniority.map((seniority) => (
                    <SelectItem key={seniority.value} value={seniority.value}>
                      {seniority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="w-full space-y-1">
              <Select>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Label
                        className="flex flex-row items-center gap-1.5"
                        htmlFor="alternativePosition"
                      >
                        Cargo suplente
                        <Info className="size-4" />
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent className="font-normal">
                      Seu cargo suplente é a função que você pode exercer caso o
                      cargo desejável não esteja disponível.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cargo..." />
                </SelectTrigger>
                <SelectContent>
                  {alternativePositions.map((alternativePosition) => (
                    <SelectItem
                      key={alternativePosition.value}
                      value={alternativePosition.value}
                    >
                      {alternativePosition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full space-y-1">
              <Select>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Label
                        className="flex flex-row items-center gap-1.5"
                        htmlFor="alternativeSeniority"
                      >
                        Senioridade
                        <Info className="size-4" />
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent className="font-normal">
                      Sua senioridade é o nível de experiência que você possui
                      na área.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <SelectTrigger>
                  <SelectValue placeholder="Selecione um nível..." />
                </SelectTrigger>
                <SelectContent>
                  {alternativeSeniority.map((alternativeSeniority) => (
                    <SelectItem
                      key={alternativeSeniority.value}
                      value={alternativeSeniority.value}
                    >
                      {alternativeSeniority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full pb-20 space-y-1.5">
            <Label htmlFor="message">
              Deseja participar de algum projeto existente? Selecione até 3
              projetos
            </Label>
            <MultipleSelector options={projects} />
          </div>
        </form>
      </div>
    </>
  )
}
