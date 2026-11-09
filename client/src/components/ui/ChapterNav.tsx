import { cn } from '@/lib/cn'
import { formatClock } from '@/lib/formatTime'

export interface Chapter {
  title: string
  startSeconds: number
}

interface ChapterNavProps {
  chapters: readonly Chapter[]
  activeIndex: number
  onSeek: (seconds: number) => void
}

export function ChapterNav({ chapters, activeIndex, onSeek }: ChapterNavProps) {
  return (
    <nav aria-label="Chapters" className="flex flex-wrap gap-2">
      {chapters.map((chapter, index) => (
        <button
          key={chapter.startSeconds}
          type="button"
          aria-current={index === activeIndex ? 'step' : undefined}
          onClick={() => onSeek(chapter.startSeconds)}
          className={cn(
            'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-brand-600',
            index === activeIndex
              ? 'border-brand-500 bg-brand-50 text-brand-700'
              : 'border-border bg-white text-body hover:bg-gray-50',
          )}
        >
          {formatClock(chapter.startSeconds)} · {chapter.title}
        </button>
      ))}
    </nav>
  )
}
