import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'

import { fetchProjects } from '@/api/projects'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

export function Teams() {
  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchProjects,
    retry: false,
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
                    <Button>Preencher automaticamente</Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
          <div className="flex mt-4 justify-end">
            <Button>+ Novo time</Button>
          </div>
        </div>
      </div>
    </>
  )
}
