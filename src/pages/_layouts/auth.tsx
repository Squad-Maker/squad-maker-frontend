import { SearchCode } from 'lucide-react'
import { Outlet } from 'react-router-dom'

import background from '@/assets/background.jpg'

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative hidden flex-col justify-between py-10 p-20 md:flex">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${background})`,
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 flex items-center gap-3 text-lg">
          <SearchCode className="size-8 text-primary" />
          <h2 className="text-2xl font-semibold leading-9 tracking-tight text-gray-50">
            SquadMaker
          </h2>
        </div>

        <footer className="relative text-gray-300 z-10 text-sm">
          &copy; {new Date().getFullYear()} SquadMaker. Todos os direitos
          reservados.
        </footer>
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
    </div>
  )
}
