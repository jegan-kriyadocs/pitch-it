import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react'

import { useArrowKeyNavigation } from '@/hooks/useArrowKeyNavigation'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { SlideCanvas } from '@/ui/SlideCanvas'
import { findTemplate } from './authorStudioData'
import { useAuthorStudioStore } from './authorStudioStore'

export function SlideDeckPresenter() {
  const templateId = useAuthorStudioStore((state) => state.templateId)
  const slideIndex = useAuthorStudioStore((state) => state.slideIndex)
  const goToNextSlide = useAuthorStudioStore((state) => state.goToNextSlide)
  const goToPreviousSlide = useAuthorStudioStore((state) => state.goToPreviousSlide)
  useArrowKeyNavigation(goToPreviousSlide, goToNextSlide)

  const slides = findTemplate(templateId).slides
  const slide = slides[slideIndex]
  const isFirstSlide = slideIndex === 0
  const isLastSlide = slideIndex === slides.length - 1

  if (!slide) {
    return null
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <SlideCanvas
        eyebrow={`Slide ${slide.pageNumber}`}
        title={slide.title}
        points={slide.points}
        footer="Pitch It · Author Studio"
        className="border-b border-border"
      />

      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <Button variant="secondary" size="sm" onClick={goToPreviousSlide} disabled={isFirstSlide}>
          <ChevronLeft aria-hidden />
          <span className="hidden xs:inline">Previous</span>
          <span className="sr-only xs:hidden">Previous slide</span>
        </Button>
        <p role="status" className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          Slide {slideIndex + 1} of {slides.length}
        </p>
        <Button variant="secondary" size="sm" onClick={goToNextSlide} disabled={isLastSlide}>
          <span className="hidden xs:inline">Next</span>
          <span className="sr-only xs:hidden">Next slide</span>
          <ChevronRight aria-hidden />
        </Button>
      </div>

      <div className="flex flex-col gap-2 bg-amber-50/60 px-5 py-4">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.06em] text-amber-800 uppercase">
          <Lightbulb size={14} aria-hidden />
          Presenter cue notes
        </h3>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-heading-secondary">
          {slide.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <p className="text-xs text-muted">Tip: use the ← and → keys to change slides while recording.</p>
      </div>
    </Card>
  )
}
