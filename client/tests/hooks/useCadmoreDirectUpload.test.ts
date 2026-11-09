import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useCadmoreDirectUpload } from '@/hooks/useCadmoreDirectUpload'

describe('useCadmoreDirectUpload', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('moves through upload, transcoding and captioning to complete', async () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useCadmoreDirectUpload('BMJ-2026-08912'))

    act(() => result.current.start(onComplete))
    expect(result.current.stage).toBe('uploading')

    for (let tick = 0; tick < 80 && result.current.stage !== 'complete'; tick += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(120)
      })
    }

    expect(result.current.stage).toBe('complete')
    expect(result.current.result?.videoDoi).toBe('10.1136/bmj-2026-08912.pitch')
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('resets back to idle', () => {
    const { result } = renderHook(() => useCadmoreDirectUpload('BMJ-2026-08912'))

    act(() => result.current.start(vi.fn()))
    act(() => result.current.reset())

    expect(result.current.stage).toBe('idle')
    expect(result.current.progress).toBe(0)
  })
})

