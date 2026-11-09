import { EyeOff, Presentation } from 'lucide-react'
import { useState } from 'react'

import type { SimulatedPlayback } from '@/hooks/useSimulatedPlayback'
import type { BlindedPitch } from '@/types/reviewerFeedback'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { SectionCard } from '@/ui/SectionCard'
import { SimulatedPitchPlayer } from '@/ui/SimulatedPitchPlayer'
import { SynchronizedSlideViewer } from '@/ui/SynchronizedSlideViewer'

interface AuthorPitchBlindedPlayerProps {
  pitch: BlindedPitch
  playback: SimulatedPlayback
  caption: string
  activeSlideIndex: number
}

export function AuthorPitchBlindedPlayer({ pitch, playback, caption, activeSlideIndex }: AuthorPitchBlindedPlayerProps) {
  const [areSlidesVisible, setAreSlidesVisible] = useState(true)

  return (
    <SectionCard step={1} title="Watch the blinded pitch" icon={EyeOff} description={pitch.title}>
      <SimulatedPitchPlayer
        presenterLabel="Anonymized author"
        isAnonymized
        durationSeconds={pitch.durationSeconds}
        slides={pitch.slides}
        playback={playback}
        caption={caption}
        activeSlideIndex={activeSlideIndex}
        overlay={
          <Badge variant="brand" className="absolute top-3 right-3 bg-white/90">
            <EyeOff size={13} aria-hidden />
            Author identity shielded
          </Badge>
        }
        extraControls={
          <Button
            variant={areSlidesVisible ? 'secondary' : 'ghost'}
            size="sm"
            aria-pressed={areSlidesVisible}
            aria-label="Show synced slides"
            onClick={() => setAreSlidesVisible(!areSlidesVisible)}
          >
            <Presentation aria-hidden />
          </Button>
        }
      />
      {areSlidesVisible && (
        <SynchronizedSlideViewer slides={pitch.slides} activeSlideIndex={activeSlideIndex} onJumpToSlide={playback.seek} />
      )}
    </SectionCard>
  )
}
