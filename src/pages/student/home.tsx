import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom'

import { fetchStudentData } from '@/api/student-data'

export function StudentHome() {
  const { data: studentData } = useQuery({
    queryKey: ['studentData'],
    queryFn: fetchStudentData,
    retry: false,
  })

  if (studentData && !studentData.hadFirstUpdate) {
    return <Navigate to="/student/profile" replace />
  }

  return <Navigate to="/student/project" replace />
}
