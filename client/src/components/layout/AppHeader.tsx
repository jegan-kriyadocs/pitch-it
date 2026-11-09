import kriyadocsLogo from '@/assets/kriyadocs-logo.png'

export function AppHeader() {
  return (
    <header className="flex h-15 shrink-0 items-center justify-between border-b border-border bg-white px-5 xs:px-8">
      <img src={kriyadocsLogo} alt="Kriyadocs" className="h-8.5 w-auto" />
    </header>
  )
}
