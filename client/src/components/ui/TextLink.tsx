import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/cn'

type TextLinkVariant = 'brand' | 'muted'

interface TextLinkProps extends ComponentProps<typeof Link> {
  variant?: TextLinkVariant
}

const VARIANT_CLASSES: Record<TextLinkVariant, string> = {
  brand: 'font-medium text-brand-600 hover:text-brand-700',
  muted: 'text-muted hover:text-body',
}

export function TextLink({ variant = 'brand', className, ...linkProps }: TextLinkProps) {
  return (
    <Link
      className={cn(
        'rounded-sm underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...linkProps}
    />
  )
}
