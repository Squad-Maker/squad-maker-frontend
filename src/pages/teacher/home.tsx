import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { fetchAllStudents } from '@/api/read-all-students'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const ITEMS_PER_PAGE = 10

export function TeacherHome() {
  const [currentPage, setCurrentPage] = useState(1)

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: () => fetchAllStudents(),
    retry: false,
  })

  const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentStudents = students.slice(startIndex, endIndex)

  const getPageNumbers = () => {
    const delta = 2
    const range = []
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      range.unshift('...')
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...')
    }

    range.unshift(1)
    if (totalPages !== 1) {
      range.push(totalPages)
    }

    return range
  }

  return (
    <>
      <Helmet title="Início" />

      <div className="p-4 md:px-12 md:py-4">
        <h1 className="text-2xl md:text-3xl pb-2 font-semibold">Visão geral</h1>
        <p className="pb-4 text-muted-foreground">
          Visualize informações sobre os alunos
        </p>

        <div className="flex flex-col space-y-4">
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Senioridade</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Ferramentas</TableHead>
                  <TableHead>Projeto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email || 'N/A'}</TableCell>
                    <TableCell>{student.competenceLevelName}</TableCell>
                    <TableCell>{student.positionOption1Name}</TableCell>
                    <TableCell title={student.tools.join(', ')}>
                      {student.tools.join(', ').length > 30
                        ? `${student.tools.join(', ').slice(0, 30)}...`
                        : student.tools.join(', ')}
                    </TableCell>

                    <TableCell>
                      {student.inProjects.length > 0 ? (
                        student.inProjects
                          .map((project) => project.name)
                          .join(', ')
                      ) : (
                        <span className="text-red-500 font-medium">Nenhum</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center pl-2">
            <p className="text-sm w-full font-medium text-muted-foreground">
              Exibindo {startIndex + 1}-{Math.min(endIndex, students.length)} de{' '}
              {students.length} alunos
            </p>

            <Pagination className="justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-accent'}`}
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNumber, idx) => (
                  <PaginationItem key={idx}>
                    {pageNumber === '...' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        className={
                          pageNumber === currentPage
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'hover:bg-accent cursor-pointer'
                        }
                        onClick={() => setCurrentPage(Number(pageNumber))}
                      >
                        {pageNumber}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-accent'}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </>
  )
}
