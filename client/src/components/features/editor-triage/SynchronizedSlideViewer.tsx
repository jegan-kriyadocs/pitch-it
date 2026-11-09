import { cn } from '@/lib/cn'
import { formatClock } from '@/lib/formatTime'
import type { PitchSlide } from '@/types/editorTriage'
import { Card } from '@/ui/Card'
import { SlideCanvas } from '@/ui/SlideCanvas'

interface SynchronizedSlideViewerProps {
  slides: PitchSlide[]
  activeSlideIndex: number
  onJumpToSlide: (startSeconds: number) => void
}

export function SynchronizedSlideViewer({ slides, activeSlideIndex, onJumpToSlide }: SynchronizedSlideViewerProps) {
  const activeSlide = slides[activeSlideIndex]
  if (!activeSlide) {
    return null
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <div aria-live="polite">
        <SlideCanvas
          eyebrow={`Slide ${activeSlideIndex + 1} of ${slides.length}`}
          title={activeSlide.title}
          points={activeSlide.points}
          footer="Synced with the pitch video"
          className="border-b border-border"
        />
      </div>
      <ul aria-label="Slide thumbnails" className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4">
        {slides.map((slide, index) => (
          <li key={slide.startSeconds}>
            <button
              type="button"
              aria-current={index === activeSlideIndex ? 'true' : undefined}
              onClick={() => onJumpToSlide(slide.startSeconds)}
              className={cn(
                'flex h-full w-full cursor-pointer flex-col gap-1 rounded-base border p-2 text-left focus-visible:outline-2 focus-visible:outline-brand-600',
                index === activeSlideIndex ? 'border-brand-500 bg-brand-50' : 'border-border hover:bg-gray-50',
              )}
            >
              <span className="text-[11px] font-semibold text-brand-600">
                {index + 1} · {formatClock(slide.startSeconds)}
              </span>
              <span className="line-clamp-2 text-xs font-medium text-heading">{slide.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
