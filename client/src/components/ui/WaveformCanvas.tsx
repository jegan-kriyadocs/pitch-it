import { useEffect, useRef } from 'react'

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 96
const LINE_COLOR = '#5f259f'
const IDLE_COLOR = '#d4c4ec'

interface WaveformCanvasProps {
  analyser: AnalyserNode | null
  label: string
}

export function WaveformCanvas({ analyser, label }: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d')
    if (!context) {
      return
    }
    const samples = analyser ? new Uint8Array(analyser.fftSize) : null
    let frameId = 0

    const draw = () => {
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      context.lineWidth = 2
      context.strokeStyle = samples ? LINE_COLOR : IDLE_COLOR
      context.beginPath()
      if (analyser && samples) {
        analyser.getByteTimeDomainData(samples)
        samples.forEach((sample, index) => {
          const x = (index / (samples.length - 1)) * CANVAS_WIDTH
          const y = (sample / 255) * CANVAS_HEIGHT
          if (index === 0) {
            context.moveTo(x, y)
          } else {
            context.lineTo(x, y)
          }
        })
      } else {
        context.moveTo(0, CANVAS_HEIGHT / 2)
        context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2)
      }
      context.stroke()
      frameId = requestAnimationFrame(draw)
    }
    frameId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameId)
  }, [analyser])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      role="img"
      aria-label={label}
      className="h-24 w-full rounded-base bg-brand-50"
    />
  )
}
