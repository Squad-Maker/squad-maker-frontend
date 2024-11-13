import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export function AppLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    if (token) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  return (
    <div>
      <Outlet />
    </div>
  )
}
