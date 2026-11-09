import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

interface SlideCanvasProps {
  eyebrow: string
  title: string
  points: readonly string[]
  footer?: ReactNode
  className?: string
}

export function SlideCanvas({ eyebrow, title, points, footer, className }: SlideCanvasProps) {
  return (
    <section
      aria-roledescription="slide"
      aria-label={`${eyebrow}: ${title}`}
      className={cn(
        'flex aspect-video flex-col justify-between gap-3 bg-linear-to-br from-brand-50 via-white to-sky-100 p-5 sm:p-8',
        className,
      )}
    >
      <span className="text-xs font-semibold tracking-[0.06em] text-brand-600 uppercase">{eyebrow}</span>
      <div className="flex flex-col gap-3 sm:gap-4">
        <h2 className="text-lg leading-tight font-semibold text-heading sm:text-2xl">{title}</h2>
        <ul className="flex flex-col gap-1.5 text-sm text-heading-secondary sm:text-base">
          {points.map((point) => (
            <li key={point} className="flex gap-2">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" />
              {point}
            </li>
          ))}
        </ul>
      </div>
      <span className="self-end text-xs text-muted">{footer ?? 'Pitch It'}</span>
    </section>
  )
}
