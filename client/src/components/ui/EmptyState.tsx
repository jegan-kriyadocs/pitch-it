import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3 text-center', className)}>
      <span className="flex size-13 items-center justify-center rounded-full bg-brand-50">
        <Icon size={24} aria-hidden className="text-brand-600" />
      </span>
      <h2 className="text-lg font-semibold text-heading">{title}</h2>
      <p className="max-w-[440px] text-sm leading-relaxed text-body">{description}</p>
    </div>
  )
}
