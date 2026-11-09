import { describe, expect, it } from 'vitest'

import { formatClock, formatDurationLabel, formatFileSize } from '@/lib/formatTime'

describe('formatTime', () => {
  it('formats a clock as mm:ss', () => {
    expect(formatClock(0)).toBe('00:00')
    expect(formatClock(102.7)).toBe('01:42')
  })

  it('formats a duration label', () => {
    expect(formatDurationLabel(180)).toBe('3m 00s')
  })

  it('formats file sizes', () => {
    expect(formatFileSize(512 * 1024)).toBe('512 KB')
    expect(formatFileSize(15 * 1024 * 1024)).toBe('15.0 MB')
  })
})

