import { Circle, CircleCheck, PartyPopper, RotateCcw, Send } from 'lucide-react'

import type { ReviewerEvaluation } from '@/hooks/useReviewerEvaluation'
import { cn } from '@/lib/cn'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'

interface ReviewSubmitBarProps {
  evaluation: ReviewerEvaluation
  onOpenSummary: () => void
  onStartOver: () => void
}

export function ReviewSubmitBar({ evaluation, onOpenSummary, onStartOver }: ReviewSubmitBarProps) {
  if (evaluation.submissionStatus === 'submitted') {
    return (
      <Card className="flex flex-col gap-3 border-emerald-100 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <PartyPopper size={18} aria-hidden />
          Review submitted. Thank you for your time.
        </p>
        <Button variant="secondary" onClick={onStartOver}>
          <RotateCcw aria-hidden />
          Start over (demo)
        </Button>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
      <ul aria-label="Review checklist" className="flex flex-wrap gap-x-5 gap-y-2">
        {evaluation.checklist.map((item) => {
          const Icon = item.isDone ? CircleCheck : Circle
          return (
            <li key={item.label} className={cn('flex items-center gap-1.5 text-[13px]', item.isDone ? 'text-green-700' : 'text-body')}>
              <Icon size={15} aria-hidden />
              {item.label}
              {!item.isRequired && <span className="text-muted">(optional)</span>}
              <span className="sr-only">{item.isDone ? 'done' : 'not done'}</span>
            </li>
          )
        })}
      </ul>
      <Button onClick={onOpenSummary} className="lg:shrink-0">
        <Send aria-hidden />
        Submit peer review package
      </Button>
    </Card>
  )
}
