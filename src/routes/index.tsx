import { createBrowserRouter } from 'react-router-dom'

import { AuthLayout } from '@/pages/_layouts/auth'
import { NotFound } from '@/pages/404'
import { SignIn } from '@/pages/auth/sign-in'
import { ErrorPage } from '@/pages/error'
import { StudentHome } from '@/pages/student/home'
import { StudentProfile } from '@/pages/student/profile'
import { StudentProject } from '@/pages/student/project'
import { TeacherHome } from '@/pages/teacher/home'
import { Teams } from '@/pages/teacher/teams'

import { AuthGuard } from './auth-guard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: <SignIn />,
      },
      {
        path: 'sign-in',
        element: <SignIn />,
      },
    ],
  },
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
    children: [
      {
        path: 'teams',
        element: <Teams />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
