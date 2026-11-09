import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

interface CardProps {
  children: ReactNode
  raised?: boolean
  className?: string
}

export function Card({ children, raised = false, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-white',
        raised && 'shadow-raised',
        className,
      )}
    >
      {children}
    </div>
  )
}
