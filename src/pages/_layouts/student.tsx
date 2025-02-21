import { PanelsTopLeft, User } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'

import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
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
    url: 'project',
    icon: PanelsTopLeft,
  },
  {
    name: 'Perfil',
    url: 'profile',
    icon: User,
  },
]

export function StudentLayout() {
  const location = useLocation()

  const getBreadcrumbTitle = (path: string) => {
    switch (path) {
      case '/student/project':
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
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
