import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { signOut } from '@/api/sign-out'

export function useSignOut() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate: signOutFn, isPending: isSigningOut } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear()

      navigate('/sign-in', { replace: true })
    },
  })

  return { signOutFn, isSigningOut }
}
