import { FileText } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/cn'
import { formatClock } from '@/lib/formatTime'
import type { TranscriptSegment } from '@/types/editorTriage'
import { Card } from '@/ui/Card'
import { SearchField } from '@/ui/SearchField'

interface TranscriptSearchPanelProps {
  transcript: TranscriptSegment[]
  activeSegmentIndex: number
  onSeek: (seconds: number) => void
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query) {
    return text
  }
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'))
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="rounded-sm bg-amber-200 px-0.5 text-heading">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export function TranscriptSearchPanel({ transcript, activeSegmentIndex, onSeek }: TranscriptSearchPanelProps) {
  const [query, setQuery] = useState('')
  const trimmedQuery = query.trim()
  const visibleSegments = transcript
    .map((segment, index) => ({ segment, index }))
    .filter(({ segment }) => !trimmedQuery || segment.text.toLowerCase().includes(trimmedQuery.toLowerCase()))

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-semibold text-heading">
          <FileText size={17} aria-hidden className="text-brand-600" />
          Transcript
        </h2>
        <SearchField
          label="Search transcript"
          placeholder="Search keywords"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full sm:w-60"
        />
      </div>
      {trimmedQuery && (
        <p role="status" className="text-[13px] text-muted">
          {visibleSegments.length} {visibleSegments.length === 1 ? 'match' : 'matches'} for “{trimmedQuery}”
        </p>
      )}
      <ol className="flex max-h-72 flex-col gap-1 overflow-y-auto">
        {visibleSegments.map(({ segment, index }) => (
          <li key={segment.startSeconds}>
            <button
              type="button"
              aria-current={index === activeSegmentIndex ? 'true' : undefined}
              onClick={() => onSeek(segment.startSeconds)}
              className={cn(
                'flex w-full cursor-pointer gap-3 rounded-base px-2.5 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-brand-600',
                index === activeSegmentIndex ? 'bg-brand-50 text-heading' : 'text-body hover:bg-gray-50',
              )}
            >
              <span className="shrink-0 font-mono text-xs leading-5 text-brand-600 tabular-nums">
                {formatClock(segment.startSeconds)}
              </span>
              <span>
                <HighlightedText text={segment.text} query={trimmedQuery} />
              </span>
            </button>
          </li>
        ))}
      </ol>
    </Card>
  )
}
