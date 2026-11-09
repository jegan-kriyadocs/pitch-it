import { useEffect, useRef, type RefObject } from 'react'

import { drawPresenterFrame } from '@/lib/presenterFrame'

const FRAME_WIDTH = 1280
const FRAME_HEIGHT = 720
const CAPTION_FONT_SIZE = 30
const CAPTION_MAX_CHARS = 64

interface PresenterCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>
  label: string
  caption: string
  isAnonymized: boolean
  isPlaying: boolean
  areCaptionsVisible: boolean
}

function wrapCaption(caption: string) {
  const lines: string[] = []
  let line = ''
  caption.split(' ').forEach((word) => {
    if (`${line} ${word}`.trim().length > CAPTION_MAX_CHARS) {
      lines.push(line)
      line = word
    } else {
      line = `${line} ${word}`.trim()
    }
  })
  return line ? [...lines, line] : lines
}

function drawCaption(context: CanvasRenderingContext2D, caption: string) {
  const lines = wrapCaption(caption)
  const lineHeight = CAPTION_FONT_SIZE * 1.35
  const boxHeight = lines.length * lineHeight + 24
  context.fillStyle = 'rgba(17, 24, 39, 0.78)'
  context.fillRect(80, FRAME_HEIGHT - boxHeight - 36, FRAME_WIDTH - 160, boxHeight)
  context.fillStyle = '#ffffff'
  context.font = `500 ${CAPTION_FONT_SIZE}px system-ui, sans-serif`
  context.textAlign = 'center'
  lines.forEach((text, index) => {
    context.fillText(text, FRAME_WIDTH / 2, FRAME_HEIGHT - boxHeight - 36 + 12 + lineHeight * (index + 0.8))
  })
}

export function PresenterCanvas({
  canvasRef,
  label,
  caption,
  isAnonymized,
  isPlaying,
  areCaptionsVisible,
}: PresenterCanvasProps) {
  const latestRef = useRef({ label, caption, isAnonymized, isPlaying, areCaptionsVisible })

  useEffect(() => {
    latestRef.current = { label, caption, isAnonymized, isPlaying, areCaptionsVisible }
  }, [label, caption, isAnonymized, isPlaying, areCaptionsVisible])

  useEffect(() => {
    let frameId = 0
    const render = (timeMs: number) => {
      const context = canvasRef.current?.getContext('2d')
      if (context) {
        const latest = latestRef.current
        drawPresenterFrame(context, {
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          timeMs: latest.isPlaying ? timeMs : 0,
          label: latest.label,
          isAnonymized: latest.isAnonymized,
          isSpeaking: latest.isPlaying,
        })
        if (latest.areCaptionsVisible && latest.caption) {
          drawCaption(context, latest.caption)
        }
      }
      frameId = requestAnimationFrame(render)
    }
    frameId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(frameId)
  }, [canvasRef])

  return (
    <canvas
      ref={canvasRef}
      width={FRAME_WIDTH}
      height={FRAME_HEIGHT}
      role="img"
      aria-label={`Pitch video: ${label}`}
      className="aspect-video w-full rounded-lg bg-gray-900"
    />
  )
}
