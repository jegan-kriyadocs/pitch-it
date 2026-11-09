import { LoaderCircle } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'border-border bg-white text-heading-secondary hover:bg-gray-50',
  ghost: 'border-transparent bg-transparent text-heading-secondary hover:bg-gray-100',
  danger: 'border-transparent bg-red-600 text-white hover:bg-red-700',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-[13px] [&_svg]:size-[13px]',
  md: 'h-[35px] gap-2 px-4 text-sm [&_svg]:size-3.5',
  lg: 'h-11 gap-2 px-4 text-sm [&_svg]:size-4',
}

const BASE_CLASSES =
  'flex shrink-0 cursor-pointer items-center justify-center rounded-base border font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  type = 'button',
  className,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className)}
      {...buttonProps}
    >
      {isLoading && <LoaderCircle aria-hidden className="motion-safe:animate-spin" />}
      {children}
    </button>
  )
}
