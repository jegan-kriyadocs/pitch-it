import { LoaderCircle, ShieldCheck } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { useCanvasMasking } from '@/hooks/useCanvasMasking'
import type { MediaStreamStatus } from '@/hooks/useMediaStream'
import type { RecorderStatus } from '@/hooks/useMediaRecorder'
import { Badge } from '@/ui/Badge'
import { CountdownOverlay } from '@/ui/CountdownOverlay'

interface CameraViewfinderProps {
  stream: MediaStream | null
  streamStatus: MediaStreamStatus
  recorderStatus: RecorderStatus
  isMaskEnabled: boolean
  countdownSeconds: number | null
}

export function CameraViewfinder({
  stream,
  streamStatus,
  recorderStatus,
  isMaskEnabled,
  countdownSeconds,
}: CameraViewfinderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useCanvasMasking(videoRef, canvasRef, isMaskEnabled)

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }
    video.srcObject = stream
    if (stream) {
      void video.play().catch(() => undefined)
    }
  }, [stream])

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-900">
      <video
        ref={videoRef}
        muted
        playsInline
        aria-hidden
        className="pointer-events-none absolute size-px opacity-0"
      />
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={isMaskEnabled ? 'Camera preview with face silhouette mask' : 'Camera preview'}
        className="size-full object-cover"
      />

      {streamStatus === 'requesting' && (
        <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-gray-200">
          <LoaderCircle size={24} aria-hidden className="motion-safe:animate-spin" />
          Connecting to your camera…
        </div>
      )}

      <CountdownOverlay remainingSeconds={countdownSeconds} />

      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
        {recorderStatus === 'recording' && (
          <Badge variant="danger" className="bg-red-600 text-white">
            <span aria-hidden className="size-2 rounded-full bg-white motion-safe:animate-pulse" />
            REC
          </Badge>
        )}
        {recorderStatus === 'paused' && <Badge variant="warning">Paused</Badge>}
        {streamStatus === 'simulated' && <Badge variant="info">Simulated camera</Badge>}
      </div>

      {isMaskEnabled && (
        <Badge variant="brand" className="absolute bottom-3 left-3">
          <ShieldCheck size={13} aria-hidden />
          Face silhouette masked
        </Badge>
      )}
    </div>
  )
}
