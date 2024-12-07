import { PanelsTopLeft, User } from 'lucide-react'
import { useLocation } from 'react-router-dom'

import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const studentMenus = [
  {
    name: 'Projetos',
    url: '#',
    icon: PanelsTopLeft,
  },
  {
    name: 'Perfil',
    url: '#',
    icon: User,
  },
]

export function StudentLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const getBreadcrumbTitle = (path: string) => {
    switch (path) {
      case '/student/projects':
        return 'Projetos'
      case '/student/profile':
        return 'Perfil'
      default:
        return '...'
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar menus={studentMenus} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/student/home">Início</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {getBreadcrumbTitle(location.pathname)}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
