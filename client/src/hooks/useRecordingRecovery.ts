import { useEffect, useState } from 'react'

import { clearRecording, loadRecoveredRecording, type RecoveredRecording } from '@/lib/storage'

export function useRecordingRecovery(isEnabled: boolean) {
  const [recovered, setRecovered] = useState<RecoveredRecording | null>(null)

  useEffect(() => {
    if (!isEnabled) {
      return
    }
    let isActive = true
    loadRecoveredRecording()
      .then((recording) => {
        if (isActive) {
          setRecovered(recording)
        }
      })
      .catch(() => undefined)
    return () => {
      isActive = false
    }
  }, [isEnabled])

  function dismiss() {
    setRecovered(null)
  }

  function discard() {
    setRecovered(null)
    void clearRecording()
  }

  return { recovered, dismiss, discard }
}
