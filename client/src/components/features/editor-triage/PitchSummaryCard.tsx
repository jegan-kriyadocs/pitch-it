import { Sparkles } from 'lucide-react'

import { formatClock } from '@/lib/formatTime'
import type { SummaryPoint } from '@/types/pitch'
import { SectionCard } from '@/ui/SectionCard'

interface PitchSummaryCardProps {
  summary: SummaryPoint[]
  onSeek: (seconds: number) => void
}

export function PitchSummaryCard({ summary, onSeek }: PitchSummaryCardProps) {
  if (summary.length === 0) {
    return null
  }

  return (
    <SectionCard title="30-second AI summary" icon={Sparkles} description="Jump straight to the key moments of the pitch.">
      <ul className="flex flex-col gap-1">
        {summary.map((point) => (
          <li key={point.startSeconds}>
            <button
              type="button"
              onClick={() => onSeek(point.startSeconds)}
              className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-base px-2.5 py-2 text-left text-sm text-heading hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-brand-600"
            >
              {point.label}
              <span className="rounded-full bg-brand-50 px-2 py-px font-mono text-xs text-brand-700">
                {formatClock(point.startSeconds)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
