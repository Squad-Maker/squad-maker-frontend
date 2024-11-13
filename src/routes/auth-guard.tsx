import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { profile } from '@/api/profile'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
