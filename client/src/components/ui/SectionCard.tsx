import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'
import { Card } from '@/ui/Card'

interface SectionCardProps {
  title: string
  icon?: LucideIcon
  description?: ReactNode
  step?: number
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionCard({ title, icon: Icon, description, step, actions, children, className }: SectionCardProps) {
  return (
    <Card className={cn('flex flex-col gap-4 p-4 sm:p-5', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {step !== undefined && (
            <span className="text-[11px] font-semibold tracking-[0.06em] text-brand-600 uppercase">Step {step}</span>
          )}
          <h2 className="flex items-center gap-2 text-base font-semibold text-heading">
            {Icon && <Icon size={17} aria-hidden className="shrink-0 text-brand-600" />}
            {title}
          </h2>
          {description && <div className="text-[13px] text-muted">{description}</div>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </Card>
  )
}
