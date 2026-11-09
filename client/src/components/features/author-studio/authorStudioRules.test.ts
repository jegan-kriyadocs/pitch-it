import { describe, expect, it } from 'vitest'

import {
  getPaceFeedback,
  getVideoWarnings,
  isStudioBusy,
  isStudioLocked,
  validateVideoFile,
} from './authorStudioRules'

function createFile(type: string, sizeBytes: number) {
  const file = new File(['x'], 'pitch.mp4', { type })
  Object.defineProperty(file, 'size', { value: sizeBytes })
  return file
}

describe('getPaceFeedback', () => {
  it.each([
    [100, 'Pacing slow'],
    [120, 'Comfortable pace'],
    [140, 'Ideal pace'],
    [160, 'Comfortable pace'],
    [175, 'Pacing fast'],
  ])('labels %i WPM as %s', (wordsPerMinute, label) => {
    expect(getPaceFeedback(wordsPerMinute).label).toBe(label)
  })
})

describe('validateVideoFile', () => {
  it('accepts an MP4 under 200 MB', () => {
    expect(validateVideoFile(createFile('video/mp4', 10_000_000))).toBeNull()
  })

  it('rejects other file types', () => {
    expect(validateVideoFile(createFile('application/pdf', 1000))).toMatch(/MP4, WebM or MOV/)
  })

  it('rejects files over 200 MB', () => {
    expect(validateVideoFile(createFile('video/mp4', 201 * 1024 * 1024))).toMatch(/200 MB/)
  })
})

describe('getVideoWarnings', () => {
  it('warns about long and low-resolution videos', () => {
    expect(getVideoWarnings(300, 480)).toHaveLength(2)
  })

  it('has no warnings for a 2 minute 1080p video', () => {
    expect(getVideoWarnings(120, 1080)).toEqual([])
  })
})

describe('studio locks', () => {
  it('locks while recording or uploading but only busy-locks before success', () => {
    expect(isStudioBusy('recording')).toBe(true)
    expect(isStudioBusy('success')).toBe(false)
    expect(isStudioLocked('success')).toBe(true)
    expect(isStudioLocked('reviewing')).toBe(false)
  })
})
