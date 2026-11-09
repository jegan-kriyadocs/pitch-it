export interface VideoMetadata {
  durationSeconds: number
  width: number
  height: number
}

export function readVideoMetadata(url: string) {
  return new Promise<VideoMetadata>((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.onloadedmetadata = () => {
      resolve({
        durationSeconds: Number.isFinite(video.duration) ? video.duration : 0,
        width: video.videoWidth,
        height: video.videoHeight,
      })
      video.removeAttribute('src')
    }
    video.onerror = () => reject(new Error('Unable to read video metadata'))
    video.src = url
  })
}
