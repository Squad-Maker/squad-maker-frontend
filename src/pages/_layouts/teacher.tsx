import { Handshake, PanelsTopLeft, Settings, Users } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'

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

const teacherMenus = [
  {
    name: 'Pessoas',
    url: '/teacher/people',
    icon: Users,
  },
  {
    name: 'Projetos',
    url: '/teacher/projects',
    icon: PanelsTopLeft,
  },
  {
    name: 'Times',
    url: '/teacher/teams',
    icon: Handshake,
  },
  {
    name: 'Configurações',
    url: '/teacher/settings',
    icon: Settings,
  },
]

export function TeacherLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const getBreadcrumbTitle = (path: string) => {
    switch (path) {
      case '/teacher/people':
        return 'Pessoas'
      case '/teacher/projects':
        return 'Projetos'
      case '/teacher/teams':
        return 'Times'
      case '/teacher/settings':
        return 'Configurações'
      default:
        return '...'
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar menus={teacherMenus} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/teacher/home">Início</BreadcrumbLink>
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
        <main>
          {children}
          <Outlet />{' '}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
