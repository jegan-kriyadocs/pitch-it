import { History } from 'lucide-react'

import { formatClock } from '@/lib/formatTime'
import { Button } from '@/ui/Button'

interface RecoveryBannerProps {
  durationSeconds: number
  onRestore: () => void
  onDiscard: () => void
}

export function RecoveryBanner({ durationSeconds, onRestore, onDiscard }: RecoveryBannerProps) {
  return (
    <div
      role="status"
      className="flex flex-col gap-3 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 sm:flex-row sm:items-center"
    >
      <History size={18} aria-hidden className="shrink-0 text-brand-700" />
      <p className="flex-1 text-sm text-brand-800">
        We found an unsaved recording ({formatClock(durationSeconds)}) from your last session.
      </p>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onDiscard}>
          Discard
        </Button>
        <Button size="sm" onClick={onRestore}>
          Restore recording
        </Button>
      </div>
    </div>
  )
}
