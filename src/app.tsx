import './global.css'

import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'

import { ThemeProvider } from '@/components/theme/theme-provider'
import { router } from '@/routes'

export function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="squad-maker-theme">
        <Helmet titleTemplate="%s | Squad Maker" />
        <RouterProvider router={router} />
      </ThemeProvider>
    </HelmetProvider>
  )
}
