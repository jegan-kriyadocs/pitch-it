import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h1 className="text-2xl leading-[normal] font-semibold text-heading">{title}</h1>
        <p className="text-sm leading-[normal] text-body">{description}</p>
      </div>
      {actions}
    </div>
  )
}
