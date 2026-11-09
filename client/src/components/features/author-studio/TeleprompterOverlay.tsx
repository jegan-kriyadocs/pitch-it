import { AArrowDown, AArrowUp, ScrollText } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'

import { cn } from '@/lib/cn'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { ToggleSwitch } from '@/ui/ToggleSwitch'
import { findTemplate } from './authorStudioData'
import { getPaceFeedback } from './authorStudioRules'
import { TELEPROMPTER_LIMITS, useAuthorStudioStore } from './authorStudioStore'

const FONT_STEP = 2

function countWords(text: string) {
  return text.split(/\s+/).filter(Boolean).length
}

export function TeleprompterOverlay() {
  const templateId = useAuthorStudioStore((state) => state.templateId)
  const slideIndex = useAuthorStudioStore((state) => state.slideIndex)
  const isScriptGenerated = useAuthorStudioStore((state) => state.isScriptGenerated)
  const recordingState = useAuthorStudioStore((state) => state.recordingState)
  const settings = useAuthorStudioStore((state) => state.teleprompter)
  const updateTeleprompter = useAuthorStudioStore((state) => state.updateTeleprompter)
  const scrollRef = useRef<HTMLDivElement>(null)
  const speedId = useId()

  const slides = findTemplate(templateId).slides
  const pace = getPaceFeedback(settings.wordsPerMinute)
  const isScrolling = isScriptGenerated && settings.isAutoScrollEnabled && recordingState === 'recording'

  useEffect(() => {
    const container = scrollRef.current
    const activeParagraph = container?.querySelector<HTMLElement>('[data-active="true"]')
    if (container && activeParagraph && !isScrolling) {
      container.scrollTop = activeParagraph.offsetTop - 8
    }
  }, [slideIndex, isScrolling])

  useEffect(() => {
    const container = scrollRef.current
    if (!container || !isScrolling) {
      return
    }
    const totalWords = slides.reduce((sum, slide) => sum + countWords(slide.script), 0)
    const readingSeconds = (totalWords / settings.wordsPerMinute) * 60
    const pixelsPerSecond = (container.scrollHeight - container.clientHeight) / readingSeconds
    let frameId = 0
    let lastTime = performance.now()
    let position = container.scrollTop

    const step = (time: number) => {
      position += (pixelsPerSecond * (time - lastTime)) / 1000
      lastTime = time
      container.scrollTop = position
      frameId = requestAnimationFrame(step)
    }
    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [isScrolling, settings.wordsPerMinute, slides])

  return (
    <section aria-label="Teleprompter" className="flex flex-col gap-3 rounded-lg border border-border bg-gray-900 p-4 text-white">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.06em] text-gray-300 uppercase">
          <ScrollText size={14} aria-hidden />
          Teleprompter
        </h3>
        <Badge variant={pace.variant}>
          {settings.wordsPerMinute} WPM · {pace.label}
        </Badge>
      </div>

      <div
        ref={scrollRef}
        tabIndex={0}
        aria-label="Pitch script"
        className="relative h-36 overflow-y-auto rounded-base bg-black/30 px-3 py-2 focus-visible:outline-2 focus-visible:outline-brand-300"
        style={{ fontSize: settings.fontSize }}
      >
        {isScriptGenerated ? (
          slides.map((slide, index) => (
            <p
              key={slide.pageNumber}
              data-active={index === slideIndex}
              className={cn('mb-3 leading-relaxed', index === slideIndex ? 'text-white' : 'text-gray-500')}
            >
              {slide.script}
            </p>
          ))
        ) : (
          <p className="text-sm text-gray-400">
            Generate a pitch script with AI to fill the teleprompter, or speak from your cue notes.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3">
          <label htmlFor={speedId} className="text-[13px] whitespace-nowrap text-gray-300">
            Speed
          </label>
          <input
            id={speedId}
            type="range"
            min={TELEPROMPTER_LIMITS.MIN_WPM}
            max={TELEPROMPTER_LIMITS.MAX_WPM}
            step={5}
            value={settings.wordsPerMinute}
            aria-valuetext={`${settings.wordsPerMinute} words per minute, ${pace.label}`}
            onChange={(event) => updateTeleprompter({ wordsPerMinute: Number(event.target.value) })}
            className="w-full accent-brand-400"
          />
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Decrease text size"
            onClick={() => updateTeleprompter({ fontSize: settings.fontSize - FONT_STEP })}
            disabled={settings.fontSize <= TELEPROMPTER_LIMITS.MIN_FONT_SIZE}
            className="text-white hover:bg-white/10"
          >
            <AArrowDown aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Increase text size"
            onClick={() => updateTeleprompter({ fontSize: settings.fontSize + FONT_STEP })}
            disabled={settings.fontSize >= TELEPROMPTER_LIMITS.MAX_FONT_SIZE}
            className="text-white hover:bg-white/10"
          >
            <AArrowUp aria-hidden />
          </Button>
        </div>
      </div>
      <div className="rounded-base bg-white p-3">
        <ToggleSwitch
          label="Auto-scroll while recording"
          isChecked={settings.isAutoScrollEnabled}
          onChange={(isAutoScrollEnabled) => updateTeleprompter({ isAutoScrollEnabled })}
        />
      </div>
    </section>
  )
}
