import { SearchCode } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import illustration from '@/assets/sign-in-illustration.svg'
import illustrationDark from '@/assets/sign-in-illustration-dark.svg'

export function AuthLayout() {
  const [theme, setTheme] = useState('')

  useEffect(() => {
    const storedTheme = localStorage.getItem('squad-maker-theme')
    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [])

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative flex-col justify-between py-10 p-20 md:flex">
        <div className="relative z-10 hidden md:flex items-center gap-3 text-lg">
          <SearchCode className="size-8 text-primary" />
          <h2 className="text-2xl font-semibold leading-9 tracking-tight text-primary">
            SquadMaker
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center p-6 md:p-10">
          <div className="flex items-center gap-3 text-lg text-foreground md:hidden">
            <SearchCode className="size-8 text-primary" />
            <h2 className="text-2xl font-semibold leading-9 tracking-tight text-foreground">
              SquadMaker
            </h2>
          </div>
          <div className="flex w-full max-w-xs flex-col items-center">
            <Outlet />
          </div>
        </div>

        <footer className="text-center md:text-left text-muted-foreground/80 z-10 text-sm">
          &copy; {new Date().getFullYear()} SquadMaker. Todos os direitos
          reservados.
        </footer>
      </div>

      <div className="hidden md:flex justify-center">
        <img
          className="w-60"
          src={theme === 'light' ? illustration : illustrationDark}
          alt="Sign illustration"
        />
      </div>
    </div>
  )
}
