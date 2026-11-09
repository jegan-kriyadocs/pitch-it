import { MapPin } from 'lucide-react'
import { useId, useState } from 'react'

import { useTimestampAnnotations } from '@/hooks/useTimestampAnnotations'
import { formatClock } from '@/lib/formatTime'
import { Button } from '@/ui/Button'
import { SectionCard } from '@/ui/SectionCard'
import { TimestampAnnotationItem } from './TimestampAnnotationItem'

interface TimestampAnnotationListProps {
  currentSeconds: number
  activeSlideIndex: number
  onPause: () => void
  onSeek: (seconds: number) => void
}

export function TimestampAnnotationList({ currentSeconds, activeSlideIndex, onPause, onSeek }: TimestampAnnotationListProps) {
  const { annotations, addAnnotation, updateAnnotation, removeAnnotation } = useTimestampAnnotations()
  const [draft, setDraft] = useState('')
  const inputId = useId()

  function pinNote() {
    onPause()
    addAnnotation(currentSeconds, activeSlideIndex, draft)
    setDraft('')
  }

  return (
    <SectionCard
      title="Timestamped notes"
      icon={MapPin}
      description="Pause on a moment and pin a note to it. Click a time to jump back."
    >
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault()
          pinNote()
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          Note for {formatClock(currentSeconds)}
        </label>
        <input
          id={inputId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="e.g. Error bars look like SEM, not 95% CI"
          className="h-[38px] min-w-0 flex-1 rounded-base border border-border bg-white px-3 text-sm text-heading outline-hidden placeholder:text-muted focus:border-brand-500 focus:ring-3 focus:ring-brand-100"
        />
        <Button type="submit" disabled={!draft.trim()} className="h-[38px]">
          <MapPin aria-hidden />
          Pin note @ {formatClock(currentSeconds)}
        </Button>
      </form>
      {annotations.length === 0 ? (
        <p className="text-[13px] text-muted">No notes yet.</p>
      ) : (
        <ul aria-label="Pinned notes" className="flex flex-col gap-2">
          {annotations.map((annotation) => (
            <TimestampAnnotationItem
              key={annotation.id}
              annotation={annotation}
              onSeek={onSeek}
              onUpdate={updateAnnotation}
              onRemove={removeAnnotation}
            />
          ))}
        </ul>
      )}
    </SectionCard>
  )
}
