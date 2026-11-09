import { Search } from 'lucide-react'
import { useId, type ComponentProps } from 'react'

import { cn } from '@/lib/cn'

interface SearchFieldProps extends Omit<ComponentProps<'input'>, 'type'> {
  label: string
}

export function SearchField({ label, id, className, ...inputProps }: SearchFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={cn('relative', className)}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <Search
        size={16}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
      />
      <input
        id={inputId}
        type="search"
        className="h-[38px] w-full rounded-base border border-border bg-white pr-3 pl-9 text-sm text-heading outline-hidden placeholder:text-muted focus:border-brand-500 focus:ring-3 focus:ring-brand-100 [&::-webkit-search-cancel-button]:appearance-none"
        {...inputProps}
      />
    </div>
  )
}
