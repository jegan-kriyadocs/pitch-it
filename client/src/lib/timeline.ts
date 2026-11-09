export const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2] as const

export function findActiveIndex(items: readonly { startSeconds: number }[], currentSeconds: number) {
  let activeIndex = -1
  items.forEach((item, index) => {
    if (item.startSeconds <= currentSeconds) {
      activeIndex = index
    }
  })
  return activeIndex
}
