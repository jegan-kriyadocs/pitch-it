import { useEffect, useRef, useState } from 'react'

export type CadmoreStage = 'idle' | 'uploading' | 'transcoding' | 'captioning' | 'complete'
type ActiveStage = Exclude<CadmoreStage, 'idle' | 'complete'>

export interface CadmoreResult {
  playbackUrl: string
  captionsUrl: string
  videoDoi: string
}

const TICK_MS = 120
const STAGE_STEPS: Record<ActiveStage, number> = { uploading: 4, transcoding: 6, captioning: 8 }
const NEXT_STAGE: Record<ActiveStage, CadmoreStage> = {
  uploading: 'transcoding',
  transcoding: 'captioning',
  captioning: 'complete',
}

function buildResult(manuscriptId: string): CadmoreResult {
  const slug = manuscriptId.toLowerCase()
  return {
    playbackUrl: `https://stream.cadmore.media/pitch/${slug}/master.m3u8`,
    captionsUrl: `https://stream.cadmore.media/pitch/${slug}/captions.en.vtt`,
    videoDoi: `10.1136/${slug}.pitch`,
  }
}

export function useCadmoreDirectUpload(manuscriptId: string) {
  const [stage, setStage] = useState<CadmoreStage>('idle')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<CadmoreResult | null>(null)
  const onCompleteRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (stage === 'idle' || stage === 'complete') {
      return
    }
    if (progress >= 100) {
      const nextStage = NEXT_STAGE[stage]
      setStage(nextStage)
      if (nextStage === 'complete') {
        setResult(buildResult(manuscriptId))
        onCompleteRef.current?.()
      } else {
        setProgress(0)
      }
      return
    }
    const timeoutId = window.setTimeout(
      () => setProgress((current) => Math.min(100, current + STAGE_STEPS[stage])),
      TICK_MS,
    )
    return () => window.clearTimeout(timeoutId)
  }, [stage, progress, manuscriptId])

  function start(onComplete: () => void) {
    onCompleteRef.current = onComplete
    setResult(null)
    setProgress(0)
    setStage('uploading')
  }

  function reset() {
    onCompleteRef.current = null
    setStage('idle')
    setProgress(0)
    setResult(null)
  }

  return { stage, progress, result, start, reset }
}
