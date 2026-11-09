import { useEffect, useState } from 'react'

import { useCadmoreDirectUpload } from '@/hooks/useCadmoreDirectUpload'
import { useRecordingRecovery } from '@/hooks/useRecordingRecovery'
import { clearRecording } from '@/lib/storage'
import { MANUSCRIPT_SESSION } from './authorStudioData'
import { useAuthorStudioStore } from './authorStudioStore'

type StudioDialog = 'preview' | 'submit' | 'reset' | null

export function useStudioPageActions() {
  const pitchVideo = useAuthorStudioStore((state) => state.pitchVideo)
  const setMode = useAuthorStudioStore((state) => state.setMode)
  const setPitchVideo = useAuthorStudioStore((state) => state.setPitchVideo)
  const setRecordingState = useAuthorStudioStore((state) => state.setRecordingState)
  const resetAll = useAuthorStudioStore((state) => state.resetAll)
  const recoverInterruptedState = useAuthorStudioStore((state) => state.recoverInterruptedState)
  const [openDialog, setOpenDialog] = useState<StudioDialog>(null)
  const upload = useCadmoreDirectUpload(MANUSCRIPT_SESSION.manuscriptId)
  const recovery = useRecordingRecovery(pitchVideo === null)

  useEffect(() => {
    recoverInterruptedState()
    return recoverInterruptedState
  }, [recoverInterruptedState])

  function submitToCadmore() {
    setRecordingState('uploading')
    setOpenDialog('submit')
    upload.start(() => {
      setRecordingState('success')
      void clearRecording()
    })
  }

  function confirmReset() {
    upload.reset()
    void clearRecording()
    resetAll()
    setOpenDialog(null)
  }

  function restoreRecording() {
    if (!recovery.recovered) {
      return
    }
    const { blob, durationSeconds } = recovery.recovered
    setMode('live_record')
    setPitchVideo({ blob, url: URL.createObjectURL(blob), durationSeconds, source: 'live_record' })
    recovery.dismiss()
  }

  return {
    openDialog,
    upload,
    recovery,
    openPreview: () => setOpenDialog('preview'),
    openReset: () => setOpenDialog('reset'),
    closeDialog: () => setOpenDialog(null),
    submitToCadmore,
    confirmReset,
    restoreRecording,
  }
}
