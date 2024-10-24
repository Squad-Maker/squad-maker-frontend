import { SearchCode } from 'lucide-react'

import { AccountMenu } from '@/components/account-menu'

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <div className="flex items-center gap-2">
          <SearchCode size={24} className="text-primary" />
          <h2 className="text-xl font-semibold leading-9 tracking-tight text-foreground">
            SquadMaker
          </h2>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}
