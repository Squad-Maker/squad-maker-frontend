'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { z } from 'zod'

import ModalSaving from '@/components/modal-saving'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { CompetenceLevel } from '@/grpc/generated/squad/competence-level'
import { GetStudentSubjectDataResponse } from '@/grpc/generated/squad/method'
import { Position } from '@/grpc/generated/squad/position'
import { squadServiceClient } from '@/lib/api'

const course = [{ value: 'es', label: 'Engenharia de Software' }]

const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  surname: z.string().min(2).max(50),
  email: z.string().email('Digite um email válido.'),
  telefone: z
    .string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Informe um telefone válido.'),
  course: z.string(),
  periodo: z.number(),
  linkedin: z.string().min(10),
  habilidadesDominio: z.string().min(5),
  ferramentasDominio: z.string().min(5),
  seniority: z.string(),
  cargo1: z.string(),
  cargo2: z.string(),
})

export function StudentProfile() {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState('loading')
  const [positions, setPositions] = useState<Position[]>([])
  const [competenceLevels, setCompetenceLevels] = useState<CompetenceLevel[]>(
    [],
  )

  const resposta: GetStudentSubjectDataResponse = {}

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: 'Franco',
      surname: 'Colaopinto',
      email: 'francocolaopinto@f1.com',
      telefone: '(46) 9 1234-5678',
      course: 'es',
      periodo: 4,
      linkedin: 'linkedin.com/in/franco-cola',
      habilidadesDominio: 'Python, PHP, Javascript',
      ferramentasDominio: 'VSCode, Git, Docker',
      seniority: 'pleno',
      cargo1: 'backend',
      cargo2: 'fullstack',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Formulário enviado:', values)
    setIsOpen(true)
    setStatus('loading')

    setTimeout(() => {
      setStatus('success')

      setTimeout(() => {
        setIsOpen(false)
      }, 3000)
    }, 2000)
  }

  async function test() {
    const resp = await squadServiceClient.readAllPositions({
      pagination: {
        limit: 100,
      },
    })
    setPositions(resp.data)
    const competenceLevel = await squadServiceClient.readAllCompetenceLevels({
      pagination: {
        limit: 100,
      },
    })
    setCompetenceLevels(competenceLevel.data)
  }

  useEffect(() => {
    test()
  }, [])

  return (
    <>
      <Helmet title="Perfil" />
      <div className="p-8">
        <p className="text-3xl font-semibold">Perfil</p>
        <span className="font-extralight">
          Edite seus dados para que possamos encontrar o time ideal para você!
        </span>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-8 ml-[5%]"
          >
            <p className="font-semibold text-xl">Informações pessoais</p>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Lucas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input placeholder="Oliveira" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="md:col-span-4">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="lucas.oliveira@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <InputMask
                        mask="(99) 99999-9999"
                        placeholder="(99) 99999-9999"
                        maskChar={null}
                        {...field}
                        inputRef={field.ref}
                      >
                        {(inputProps) => (
                          <Input {...inputProps} id="telefone" />
                        )}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-6 md:col-span-6 gap-4">
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Curso</FormLabel>
                      <FormControl>
                        <div className="w-full space-y-1">
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipContent className="font-normal">
                                  Sua senioridade é o nível de experiência que
                                  você possui na área.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um nível..." />
                            </SelectTrigger>
                            <SelectContent>
                              {course.map((course) => (
                                <SelectItem
                                  key={course.value}
                                  value={course.value}
                                >
                                  {course.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="periodo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período</FormLabel>
                      <FormControl>
                        <Input placeholder="7" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="linkedin.com/in/lucas-oliveira"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <span className="md:col-span-6 text-xl font-semibold mt-[2%]">
                Habilidades
              </span>
              <FormField
                control={form.control}
                name="habilidadesDominio"
                render={({ field }) => (
                  <FormItem className="md:col-span-6">
                    <FormLabel>Linguagens de Programação</FormLabel>
                    <FormControl>
                      <Input placeholder="Python, PHP, JavaScript" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ferramentasDominio"
                render={({ field }) => (
                  <FormItem className="md:col-span-5">
                    <FormLabel>Ferramentas de dominio</FormLabel>
                    <FormControl>
                      <Input placeholder="VSCode, GIT, Docker" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seniority"
                render={({ field }) => (
                  <FormItem className="md:col-span-1">
                    <FormLabel>Senioridade</FormLabel>
                    <FormControl>
                      <div className="w-full space-y-1">
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipContent className="font-normal">
                                Sua senioridade é o nível de experiência que
                                você possui na área.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um nível..." />
                          </SelectTrigger>
                          <SelectContent>
                            {competenceLevels.map((seniority) => (
                              <SelectItem
                                key={seniority.id}
                                value={seniority.id}
                              >
                                {seniority.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cargo1"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>Opção de cargo 1</FormLabel>
                    <FormControl>
                      <div className="w-full space-y-1">
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipContent className="font-normal">
                                Sua senioridade é o nível de experiência que
                                você possui na área.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um nível..." />
                          </SelectTrigger>
                          <SelectContent>
                            {positions.map((position) => (
                              <SelectItem key={position.id} value={position.id}>
                                {position.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cargo2"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>Opção de cargo 2</FormLabel>
                    <FormControl>
                      <div className="w-full space-y-1">
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipContent className="font-normal">
                                Sua senioridade é o nível de experiência que
                                você possui na área.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um nível..." />
                          </SelectTrigger>
                          <SelectContent>
                            {positions.map((position) => (
                              <SelectItem key={position.id} value={position.id}>
                                {position.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="p-5 w-full md:w-36">
                Salvar
              </Button>
              {isOpen && <ModalSaving status={status} />}
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
