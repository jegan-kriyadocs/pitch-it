import { describe, expect, it } from 'vitest'

import { useAuthorStudioStore } from '@/features/author-studio/authorStudioStore'

const getState = () => useAuthorStudioStore.getState()

describe('authorStudioStore', () => {
  it('keeps the slide index within the deck', () => {
    getState().goToPreviousSlide()
    expect(getState().slideIndex).toBe(0)
    getState().goToSlide(10)
    expect(getState().slideIndex).toBe(3)
  })

  it('returns to the first slide and clears the script when the template changes', () => {
    getState().goToSlide(2)
    getState().markScriptGenerated()
    getState().setTemplate('case_study')
    expect(getState().slideIndex).toBe(0)
    expect(getState().isScriptGenerated).toBe(false)
  })

  it('clamps teleprompter speed and font size', () => {
    getState().updateTeleprompter({ wordsPerMinute: 400, fontSize: 4 })
    expect(getState().teleprompter.wordsPerMinute).toBe(180)
    expect(getState().teleprompter.fontSize).toBe(14)
  })

  it('turns both shields on for a double-blind journal', () => {
    expect(getState().anonymization).toEqual({
      visualMaskEnabled: true,
      voiceModulationEnabled: true,
      journalPolicyEnforced: true,
    })
  })

  it('recovers from a recording interrupted by leaving the page', () => {
    getState().setRecordingState('recording')
    getState().recoverInterruptedState()
    expect(getState().recordingState).toBe('idle')
  })
})

