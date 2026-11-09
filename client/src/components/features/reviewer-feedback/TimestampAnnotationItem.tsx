import { Check, Pencil, Trash2, X } from 'lucide-react'
import { useId, useState } from 'react'

import { formatClock } from '@/lib/formatTime'
import type { TimestampAnnotation } from '@/types/reviewerFeedback'
import { Button } from '@/ui/Button'

interface TimestampAnnotationItemProps {
  annotation: TimestampAnnotation
  onSeek: (seconds: number) => void
  onUpdate: (id: string, text: string) => void
  onRemove: (id: string) => void
}

export function TimestampAnnotationItem({ annotation, onSeek, onUpdate, onRemove }: TimestampAnnotationItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(annotation.text)
  const inputId = useId()
  const timeLabel = formatClock(annotation.seconds)

  function save() {
    if (draft.trim()) {
      onUpdate(annotation.id, draft)
      setIsEditing(false)
    }
  }

  return (
    <li className="flex flex-wrap items-start gap-3 rounded-base border border-border p-3">
      <button
        type="button"
        onClick={() => onSeek(annotation.seconds)}
        aria-label={`Jump to ${timeLabel}`}
        className="shrink-0 cursor-pointer rounded-full bg-brand-50 px-2.5 py-0.5 font-mono text-xs font-semibold text-brand-700 hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-brand-600"
      >
        @ {timeLabel}
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {isEditing ? (
          <>
            <label htmlFor={inputId} className="sr-only">
              Edit note at {timeLabel}
            </label>
            <input
              id={inputId}
              value={draft}
              autoFocus
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') save()
                if (event.key === 'Escape') setIsEditing(false)
              }}
              className="h-8 w-full rounded-base border border-brand-500 px-2 text-sm text-heading outline-hidden focus:ring-3 focus:ring-brand-100"
            />
          </>
        ) : (
          <p className="text-sm text-heading">{annotation.text}</p>
        )}
        <span className="text-[11px] text-muted">Slide {annotation.slideIndex + 1}</span>
      </div>
      <div className="flex shrink-0 gap-1">
        {isEditing ? (
          <>
            <Button variant="ghost" size="sm" aria-label={`Save note at ${timeLabel}`} onClick={save}>
              <Check aria-hidden />
            </Button>
            <Button variant="ghost" size="sm" aria-label="Cancel editing" onClick={() => setIsEditing(false)}>
              <X aria-hidden />
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Edit note at ${timeLabel}`}
            onClick={() => {
              setDraft(annotation.text)
              setIsEditing(true)
            }}
          >
            <Pencil aria-hidden />
          </Button>
        )}
        <Button variant="ghost" size="sm" aria-label={`Delete note at ${timeLabel}`} onClick={() => onRemove(annotation.id)}>
          <Trash2 aria-hidden />
        </Button>
      </div>
    </li>
  )
}
