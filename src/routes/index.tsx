import { createBrowserRouter } from 'react-router-dom'

import { AuthLayout } from '@/pages/_layouts/auth'
import { NotFound } from '@/pages/404'
import { SignIn } from '@/pages/auth/sign-in'
import { ErrorPage } from '@/pages/error'
import { StudentHome } from '@/pages/student/home'
import { StudentProfile } from '@/pages/student/profile'
import { StudentProject } from '@/pages/student/projects'
import { TeacherHome } from '@/pages/teacher/home'

import { AuthGuard } from './auth-guard'

export const router = createBrowserRouter([
  {
    path: '/student',
    element: (
      <AuthGuard>
        <StudentHome />
      </AuthGuard>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <StudentHome />,
      },
      {
        path: 'profile',
        element: <StudentProfile />,
      },
      {
        path: 'project',
        element: <StudentProject />,
      },
    ],
  },
  {
    path: '/teacher',
    element: (
      <AuthGuard>
        <TeacherHome />
      </AuthGuard>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'sign-in',
        element: <SignIn />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
