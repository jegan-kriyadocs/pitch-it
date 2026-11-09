import { create } from 'zustand'

import type {
  AnonymizationConfig,
  PitchVideo,
  RecordingState,
  StudioMode,
  TemplateId,
} from '@/types/authorStudio'
import { MANUSCRIPT_SESSION, findTemplate } from './authorStudioData'

const MIN_WPM = 100
const MAX_WPM = 180
const MIN_FONT_SIZE = 14
const MAX_FONT_SIZE = 26

export interface TeleprompterSettings {
  isAutoScrollEnabled: boolean
  wordsPerMinute: number
  fontSize: number
}

interface AuthorStudioState {
  templateId: TemplateId
  slideIndex: number
  isScriptGenerated: boolean
  mode: StudioMode
  recordingState: RecordingState
  anonymization: AnonymizationConfig
  teleprompter: TeleprompterSettings
  pitchVideo: PitchVideo | null
  setTemplate: (templateId: TemplateId) => void
  goToSlide: (slideIndex: number) => void
  goToNextSlide: () => void
  goToPreviousSlide: () => void
  markScriptGenerated: () => void
  setMode: (mode: StudioMode) => void
  setRecordingState: (recordingState: RecordingState) => void
  setVisualMaskEnabled: (isEnabled: boolean) => void
  setVoiceModulationEnabled: (isEnabled: boolean) => void
  updateTeleprompter: (settings: Partial<TeleprompterSettings>) => void
  setPitchVideo: (pitchVideo: PitchVideo) => void
  clearPitchVideo: () => void
  resetAll: () => void
  recoverInterruptedState: () => void
}

const INTERRUPTIBLE_STATES: RecordingState[] = [
  'preflight',
  'countdown',
  'recording',
  'paused',
  'uploading',
]

const isDoubleBlind = MANUSCRIPT_SESSION.reviewPolicy === 'double_blind'

const INITIAL_STATE = {
  templateId: 'clinical_trial' as TemplateId,
  slideIndex: 0,
  isScriptGenerated: false,
  mode: 'live_record' as StudioMode,
  recordingState: 'idle' as RecordingState,
  anonymization: {
    visualMaskEnabled: isDoubleBlind,
    voiceModulationEnabled: isDoubleBlind,
    journalPolicyEnforced: isDoubleBlind,
  },
  teleprompter: { isAutoScrollEnabled: true, wordsPerMinute: 140, fontSize: 18 },
  pitchVideo: null,
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function slideCount(templateId: TemplateId) {
  return findTemplate(templateId).slides.length
}

export const useAuthorStudioStore = create<AuthorStudioState>()((set, get) => ({
  ...INITIAL_STATE,
  setTemplate: (templateId) => set({ templateId, slideIndex: 0, isScriptGenerated: false }),
  goToSlide: (slideIndex) =>
    set({ slideIndex: clamp(slideIndex, 0, slideCount(get().templateId) - 1) }),
  goToNextSlide: () => get().goToSlide(get().slideIndex + 1),
  goToPreviousSlide: () => get().goToSlide(get().slideIndex - 1),
  markScriptGenerated: () => set({ isScriptGenerated: true }),
  setMode: (mode) => set({ mode }),
  setRecordingState: (recordingState) => set({ recordingState }),
  setVisualMaskEnabled: (visualMaskEnabled) =>
    set({ anonymization: { ...get().anonymization, visualMaskEnabled } }),
  setVoiceModulationEnabled: (voiceModulationEnabled) =>
    set({ anonymization: { ...get().anonymization, voiceModulationEnabled } }),
  updateTeleprompter: (settings) => {
    const next = { ...get().teleprompter, ...settings }
    set({
      teleprompter: {
        ...next,
        wordsPerMinute: clamp(next.wordsPerMinute, MIN_WPM, MAX_WPM),
        fontSize: clamp(next.fontSize, MIN_FONT_SIZE, MAX_FONT_SIZE),
      },
    })
  },
  setPitchVideo: (pitchVideo) => {
    const previous = get().pitchVideo
    if (previous && previous.url !== pitchVideo.url) {
      URL.revokeObjectURL(previous.url)
    }
    set({ pitchVideo, recordingState: 'reviewing' })
  },
  clearPitchVideo: () => {
    const previous = get().pitchVideo
    if (previous) {
      URL.revokeObjectURL(previous.url)
    }
    set({ pitchVideo: null, recordingState: 'idle' })
  },
  resetAll: () => {
    get().clearPitchVideo()
    set(INITIAL_STATE)
  },
  recoverInterruptedState: () => {
    const { recordingState, pitchVideo } = get()
    if (INTERRUPTIBLE_STATES.includes(recordingState)) {
      set({ recordingState: pitchVideo ? 'reviewing' : 'idle' })
    }
  },
}))

export const TELEPROMPTER_LIMITS = { MIN_WPM, MAX_WPM, MIN_FONT_SIZE, MAX_FONT_SIZE }
