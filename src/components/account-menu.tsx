import { ChevronDown, LogOut, Moon, Sun } from 'lucide-react'

import { useTheme } from '@/components/theme/theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useSignOut } from '@/hooks/auth'

export function AccountMenu() {
  const { theme, setTheme } = useTheme()
  const { signOutFn, isSigningOut } = useSignOut()
  const isLoadingUser = false

  return (
    <Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex select-none items-center gap-4"
          >
            Meu perfil
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            {isLoadingUser ? (
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <>
                <span>Usuário</span>
                <span className="font-normal text-muted-foreground">RA</span>
              </>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild disabled={false}>
            <button
              type="button"
              className="w-full"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="mr-2 size-4 text-neutral-800 dark:hidden dark:text-neutral-200" />
              <Moon className="mr-2 hidden size-4 text-neutral-800 dark:block dark:text-neutral-200" />
              <span>Alterar tema</span>
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            disabled={isSigningOut}
            className="text-rose-500 dark:text-rose-400"
          >
            <button
              type="button"
              className="w-full"
              onClick={() => signOutFn()}
            >
              <LogOut className="mr-2 size-4" />
              <span>{isSigningOut ? 'Saindo...' : 'Sair'}</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Sheet>
  )
}
