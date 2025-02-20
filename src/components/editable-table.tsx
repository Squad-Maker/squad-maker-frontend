import { Pen, Trash } from 'lucide-react'
import { useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Record {
  id: string
  name: string
}

interface EditableTableProps<T extends Record> {
  records: T[]
  title: string
  inputPlaceholder: string
  onAdd: (name: string) => void
  onUpdate: (id: string, name: string) => void
  onDelete: (id: string) => void
}

export function EditableTable<T extends Record>({
  records,
  title,
  inputPlaceholder,
  onAdd,
  onUpdate,
  onDelete,
}: EditableTableProps<T>) {
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAddOrUpdate = () => {
    if (!newName) return

    if (editingId) {
      onUpdate(editingId, newName)
      setEditingId(null)
    } else {
      onAdd(newName)
    }
    setNewName('')
  }

  const handleEditClick = (id: string, name: string) => {
    setEditingId(id)
    setNewName(name)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setNewName('')
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg md:text-xl font-semibold hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center gap-2 my-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={inputPlaceholder}
              className="w-full"
            />
            <Button onClick={handleAddOrUpdate}>
              {editingId ? 'Atualizar' : 'Adicionar'}
            </Button>
            {editingId && (
              <Button onClick={handleCancelEdit} variant="ghost">
                Cancelar
              </Button>
            )}
          </div>

          <Table>
            <TableCaption className="px-3 font-medium text-right">
              Total: {records.length}
            </TableCaption>
            <TableHeader>
              <TableRow className="h-8">
                <TableHead className="text-left w-16 p-2 text-sm">ID</TableHead>
                <TableHead className="text-left p-2 text-sm">Nome</TableHead>
                <TableHead className="text-right w-32 p-2 text-sm">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id} className="h-8">
                  <TableCell className="text-left p-2 text-sm">
                    {record.id}
                  </TableCell>
                  <TableCell className="text-left p-2 text-sm">
                    {record.name}
                  </TableCell>
                  <TableCell className="text-right p-2">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleEditClick(record.id, record.name)}
                      >
                        <Pen className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onDelete(record.id)}
                      >
                        <Trash className="size-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
