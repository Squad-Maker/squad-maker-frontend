import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface StudentInSubject {
  id: string
  name: string
}

interface SingleSelectProps {
  students: StudentInSubject[]
  onChange: (selectedId: string | null) => void
  value: string
}

export function SingleSelect({ students, onChange, value }: SingleSelectProps) {
  const [selected, setSelected] = useState<StudentInSubject | null>(null)
  const [open, setOpen] = useState(false)

  const handleSelect = (student: StudentInSubject) => {
    setSelected(student)
    onChange(student.id)
    setOpen(false)
  }
  useEffect(() => {
    if (value) {
      const student = students.find((s) => s.id === value)
      setSelected(student || null)
    }
  }, [value, students])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selected ? selected.name : 'Selecione um aluno'}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2">
        <Command className="w-full">
          <CommandInput className="w-full" placeholder="Pesquisar aluno..." />
          <CommandList className="w-full">
            {students.map((student) => (
              <CommandItem
                key={student.id}
                onSelect={() => handleSelect(student)}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${selected?.id === student.id ? 'opacity-100' : 'opacity-0'}`}
                />
                {student.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
