import { useQuery } from '@tanstack/react-query'
import { LoaderCircleIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { profile } from '@/api/profile'
import { StudentLayout } from '@/pages/_layouts/student'
import { TeacherLayout } from '@/pages/_layouts/teacher'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  const {
    data: user,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['me'],
    queryFn: profile,
    retry: false,
  })

  useEffect(() => {
    if (isError) {
      navigate('/sign-in', { replace: true })
    }
  }, [isError, navigate])

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoaderCircleIcon className="animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (user.type === 1) {
    return <TeacherLayout>{children}</TeacherLayout>
  }

  if (user.type === 2) {
    return <StudentLayout>{children}</StudentLayout>
  }
}
