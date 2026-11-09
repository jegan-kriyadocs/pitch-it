import { useRef, useState } from 'react'

import { useCanvasMasking } from '@/hooks/useCanvasMasking'
import { useVoiceModulation } from '@/hooks/useVoiceModulation'
import type { AnonymizationConfig, PitchVideo } from '@/types/authorStudio'
import { PlaybackBar } from '@/ui/PlaybackBar'

interface BlindedPreviewPlayerProps {
  pitchVideo: PitchVideo
  anonymization: AnonymizationConfig
}

export function BlindedPreviewPlayer({ pitchVideo, anonymization }: BlindedPreviewPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSeconds, setCurrentSeconds] = useState(0)
  useCanvasMasking(videoRef, canvasRef, anonymization.visualMaskEnabled)
  useVoiceModulation(videoRef, anonymization.voiceModulationEnabled)

  function togglePlayback() {
    const video = videoRef.current
    if (!video) {
      return
    }
    if (video.paused) {
      void video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }

  function seek(seconds: number) {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-900">
        <video
          ref={videoRef}
          src={pitchVideo.url}
          playsInline
          preload="auto"
          aria-hidden
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={(event) => setCurrentSeconds(event.currentTarget.currentTime)}
          className="pointer-events-none absolute size-px opacity-0"
        />
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Reviewer view of your pitch"
          className="size-full object-contain"
        />
      </div>
      <PlaybackBar
        isPlaying={isPlaying}
        currentSeconds={currentSeconds}
        durationSeconds={Math.max(pitchVideo.durationSeconds, currentSeconds)}
        onTogglePlay={togglePlayback}
        onSeek={seek}
      />
    </div>
  )
}
