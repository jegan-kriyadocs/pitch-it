import { CircleCheck, Eye, RotateCcw, Send } from 'lucide-react'

import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'

interface StudioFooterActionsProps {
  hasVideo: boolean
  isLocked: boolean
  isSubmitted: boolean
  onReset: () => void
  onPreview: () => void
  onSubmit: () => void
}

export function StudioFooterActions({
  hasVideo,
  isLocked,
  isSubmitted,
  onReset,
  onPreview,
  onSubmit,
}: StudioFooterActionsProps) {
  return (
    <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <Button variant="ghost" onClick={onReset} disabled={isLocked}>
        <RotateCcw aria-hidden />
        {isSubmitted ? 'Start a new pitch' : 'Reset all'}
      </Button>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="secondary" onClick={onPreview} disabled={!hasVideo || isLocked}>
          <Eye aria-hidden />
          Preview both versions
        </Button>
        {isSubmitted ? (
          <Button variant="secondary" disabled>
            <CircleCheck aria-hidden />
            Submitted to Cadmore
          </Button>
        ) : (
          <Button onClick={onSubmit} disabled={!hasVideo || isLocked}>
            <Send aria-hidden />
            Submit to Cadmore
          </Button>
        )}
      </div>
    </Card>
  )
}
