import { useState } from 'react'

import { readVideoMetadata } from '@/lib/videoMetadata'
import { getVideoWarnings, validateVideoFile } from './authorStudioRules'
import { useAuthorStudioStore } from './authorStudioStore'

export function useVideoUpload() {
  const setPitchVideo = useAuthorStudioStore((state) => state.setPitchVideo)
  const clearPitchVideo = useAuthorStudioStore((state) => state.clearPitchVideo)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const [isReading, setIsReading] = useState(false)

  async function selectFile(file: File | undefined) {
    if (!file) {
      return
    }
    const validationError = validateVideoFile(file)
    if (validationError) {
      setErrorMessage(validationError)
      return
    }
    setErrorMessage(null)
    setIsReading(true)
    const url = URL.createObjectURL(file)
    try {
      const metadata = await readVideoMetadata(url)
      setWarnings(getVideoWarnings(metadata.durationSeconds, metadata.height))
      setPitchVideo({
        blob: file,
        url,
        durationSeconds: metadata.durationSeconds,
        source: 'upload_video',
        fileName: file.name,
      })
    } catch {
      URL.revokeObjectURL(url)
      setErrorMessage("We couldn't read this video. Try exporting it again as MP4.")
    } finally {
      setIsReading(false)
    }
  }

  function removeVideo() {
    setWarnings([])
    setErrorMessage(null)
    clearPitchVideo()
  }

  return { errorMessage, warnings, isReading, selectFile, removeVideo }
}
