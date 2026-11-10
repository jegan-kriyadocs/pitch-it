import { LogIn } from 'lucide-react'

import kriyadocsLogo from '@/assets/kriyadocs-logo.png'
import { TextLink } from '@/ui/TextLink'

export function AppHeader() {
  return (
    <header className="flex h-15 shrink-0 items-center justify-between border-b border-border bg-white px-5 xs:px-8">
      <img src={kriyadocsLogo} alt="Kriyadocs" className="h-8.5 w-auto" />
      <TextLink to="/login" variant="muted" className="flex items-center gap-1.5 text-[13px]">
        <LogIn size={15} aria-hidden />
        Log in
      </TextLink>
    </header>
  )
}
