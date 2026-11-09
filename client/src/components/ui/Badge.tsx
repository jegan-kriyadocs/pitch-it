import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type BadgeVariant = 'neutral' | 'info' | 'brand' | 'warning' | 'success' | 'danger'
type BadgeSize = 'xs' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
  children: ReactNode
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: 'bg-gray-100 text-gray-700',
  info: 'bg-sky-100 text-sky-700',
  brand: 'bg-brand-50 text-brand-700',
  warning: 'bg-amber-100 text-amber-800',
  success: 'bg-emerald-100 text-emerald-700',
  danger: 'bg-red-100 text-red-700',
}

const SIZE_CLASSES: Record<BadgeSize, string> = {
  xs: 'px-1.5 py-px text-[11px] leading-[normal]',
  md: 'px-2.5 py-[3px] text-xs leading-[normal]',
}

export function Badge({ variant = 'neutral', size = 'md', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm font-semibold whitespace-nowrap',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
