import { useMutation, useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'

import { fetchCompetenceLevels } from '@/api/competence-levels'
import { createCompetenceLevel } from '@/api/create-competence-level'
import { createPosition } from '@/api/create-position'
import { deleteCompetenceLevel } from '@/api/delete-competence-level'
import { deletePosition } from '@/api/delete-position'
import { fetchPositions } from '@/api/positions'
import { updateCompetenceLevel } from '@/api/update-competence-level'
import { updatePosition } from '@/api/update-position'
import { EditableTable } from '@/components/editable-table'
import { useToast } from '@/components/ui/use-toast'
import { queryClient } from '@/lib/react-query'

export function TeacherConfigs() {
  const { toast } = useToast()

  const { data: competenceLevels = [] } = useQuery({
    queryKey: ['competenceLevels'],
    queryFn: fetchCompetenceLevels,
    retry: false,
  })
  const { data: positions = [] } = useQuery({
    queryKey: ['positions'],
    queryFn: fetchPositions,
    retry: false,
  })

  // Competence Levels
  const { mutate: createCompetenceLevelFn } = useMutation({
    mutationFn: async (name: string) => {
      await createCompetenceLevel({ name })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competenceLevels'] })
      toast({
        title: 'Senioridade',
        description: 'Senioridade adicionada com sucesso!',
      })
    },
    onError: () => {
      toast({
        title: 'Ooops!',
        variant: 'destructive',
        description:
          'Ocorreu um problema ao tentar adicionar a senioridade, tente novamente.',
      })
    },
  })

  const { mutate: updateCompetenceLevelFn } = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      await updateCompetenceLevel({ id, name })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competenceLevels'] })
      toast({
        title: 'Senioridade',
        description: 'Senioridade atualizada com sucesso!',
      })
    },
    onError: () => {
      toast({
        title: 'Ooops!',
        variant: 'destructive',
        description:
          'Ocorreu um problema ao tentar atualizar a senioridade, tente novamente.',
      })
    },
  })

  const { mutate: deleteCompetenceLevelFn } = useMutation({
    mutationFn: async (id: string) => {
      await deleteCompetenceLevel({ id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competenceLevels'] })
      toast({
        title: 'Senioridade',
        description: 'Senioridade removida com sucesso!',
      })
    },
    onError: () => {
      toast({
        title: 'Ooops!',
        variant: 'destructive',
        description:
          'Ocorreu um problema ao tentar remover a senioridade, tente novamente.',
      })
    },
  })

  // Positions
  const { mutate: createPositionFn } = useMutation({
    mutationFn: async (name: string) => {
      await createPosition({ name })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] })
      toast({
        title: 'Opção de cargo',
        description: 'Opção de cargo adicionada com sucesso!',
      })
    },
    onError: () => {
      toast({
        title: 'Ooops!',
        variant: 'destructive',
        description:
          'Ocorreu um problema ao tentar adicionar a opção de cargo, tente novamente.',
      })
    },
  })

  const { mutate: updatePositionFn } = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      await updatePosition({ id, name })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] })
      toast({
        title: 'Opção de cargo',
        description: 'Opção de cargo atualizada com sucesso!',
      })
    },
    onError: () => {
      toast({
        title: 'Ooops!',
        variant: 'destructive',
        description:
          'Ocorreu um problema ao tentar atualizar a opção de cargo, tente novamente.',
      })
    },
  })

  const { mutate: deletePositionFn } = useMutation({
    mutationFn: async (id: string) => {
      await deletePosition({ id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] })
      toast({
        title: 'Opção de cargo',
        description: 'Opção de cargo removida com sucesso!',
      })
    },
    onError: () => {
      toast({
        title: 'Ooops!',
        variant: 'destructive',
        description:
          'Ocorreu um problema ao tentar remover a opção de cargo, tente novamente.',
      })
    },
  })

  return (
    <>
      <Helmet title="Configurações" />

      <div className="p-4 md:px-12 md:py-4">
        <h1 className="text-2xl md:text-3xl pb-2 font-semibold">
          Configurações
        </h1>
        <p className="pb-4 text-muted-foreground">Configurações do professor</p>

        <div className="space-y-6">
          <EditableTable
            records={competenceLevels}
            title="Senioridade"
            inputPlaceholder="Adicionar nova senioridade"
            onAdd={createCompetenceLevelFn}
            onUpdate={(id, name) => updateCompetenceLevelFn({ id, name })}
            onDelete={deleteCompetenceLevelFn}
          />

          <EditableTable
            records={positions}
            title="Opções de cargo"
            inputPlaceholder="Adicionar novo cargo"
            onAdd={createPositionFn}
            onUpdate={(id, name) => updatePositionFn({ id, name })}
            onDelete={deletePositionFn}
          />
        </div>
      </div>
    </>
  )
}
