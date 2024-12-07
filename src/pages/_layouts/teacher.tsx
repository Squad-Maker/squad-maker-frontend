export function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>Teacher Header</header>
      <aside>Teacher Sidebar</aside>
      <main>{children}</main>
    </div>
  )
}
