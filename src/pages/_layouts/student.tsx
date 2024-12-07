export function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>Student Header</header>
      <aside>Student Sidebar</aside>
      <main>{children}</main>
    </div>
  )
}
