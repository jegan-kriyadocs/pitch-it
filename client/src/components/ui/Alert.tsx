import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type AlertVariant = 'error' | 'warning' | 'info' | 'success'

interface AlertProps {
  variant: AlertVariant
  children: ReactNode
  className?: string
}

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  error: 'border-red-100 bg-red-50 text-red-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  info: 'border-brand-100 bg-brand-50 text-brand-800',
  success: 'border-green-100 bg-green-50 text-green-700',
}

const VARIANT_ICONS: Record<AlertVariant, LucideIcon> = {
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
  success: CircleCheck,
}

export function Alert({ variant, children, className }: AlertProps) {
  const Icon = VARIANT_ICONS[variant]

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex gap-2 rounded-base border px-3 py-2.5 text-[13px]',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      <Icon size={15} aria-hidden className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  )
}
