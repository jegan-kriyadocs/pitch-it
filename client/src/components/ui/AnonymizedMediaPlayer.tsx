import { useRef, useState } from 'react'

import { useCanvasMasking } from '@/hooks/useCanvasMasking'
import { useVoiceModulation } from '@/hooks/useVoiceModulation'
import { PlaybackBar } from '@/ui/PlaybackBar'
import { WaveformCanvas } from '@/ui/WaveformCanvas'

interface AnonymizedMediaPlayerProps {
  url: string
  durationSeconds: number
  kind: 'video' | 'audio'
  isMaskEnabled: boolean
  isVoiceDisguised: boolean
  label: string
  showWaveform?: boolean
}

export function AnonymizedMediaPlayer({
  url,
  durationSeconds,
  kind,
  isMaskEnabled,
  isVoiceDisguised,
  label,
  showWaveform = false,
}: AnonymizedMediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRef = kind === 'video' ? videoRef : audioRef
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSeconds, setCurrentSeconds] = useState(0)
  useCanvasMasking(videoRef, canvasRef, isMaskEnabled)
  const analyser = useVoiceModulation(mediaRef, isVoiceDisguised)

  const mediaEvents = {
    onPlay: () => setIsPlaying(true),
    onPause: () => setIsPlaying(false),
    onEnded: () => setIsPlaying(false),
    onTimeUpdate: (event: { currentTarget: HTMLMediaElement }) => setCurrentSeconds(event.currentTarget.currentTime),
  }

  function togglePlayback() {
    const media = mediaRef.current
    if (!media) {
      return
    }
    if (media.paused) {
      void media.play().catch(() => undefined)
    } else {
      media.pause()
    }
  }

  function seek(seconds: number) {
    if (mediaRef.current) {
      mediaRef.current.currentTime = seconds
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {kind === 'video' ? (
        <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-900">
          <video
            ref={videoRef}
            src={url}
            playsInline
            preload="auto"
            aria-hidden
            {...mediaEvents}
            className="pointer-events-none absolute size-px opacity-0"
          />
          <canvas ref={canvasRef} role="img" aria-label={label} className="size-full object-contain" />
        </div>
      ) : (
        <audio ref={audioRef} src={url} preload="auto" {...mediaEvents} />
      )}
      {(showWaveform || kind === 'audio') && (
        <WaveformCanvas analyser={isPlaying ? analyser : null} label={`${label} waveform`} />
      )}
      <PlaybackBar
        isPlaying={isPlaying}
        currentSeconds={currentSeconds}
        durationSeconds={Math.max(durationSeconds, currentSeconds)}
        onTogglePlay={togglePlayback}
        onSeek={seek}
      />
    </div>
  )
}
