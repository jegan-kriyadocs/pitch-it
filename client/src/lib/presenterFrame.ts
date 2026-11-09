interface PresenterFrameOptions {
  width: number
  height: number
  timeMs: number
  label: string
  isAnonymized?: boolean
  isSpeaking?: boolean
}

const OPEN_COLORS = { from: '#ebe4f5', to: '#e0f2fe', figure: '#9876c6', text: '#3d1669' }
const ANONYMIZED_COLORS = { from: '#3d1669', to: '#1f2937', figure: '#2a0e4a', text: '#ebe4f5' }

export function drawPresenterFrame(context: CanvasRenderingContext2D, options: PresenterFrameOptions) {
  const { width, height, timeMs, label, isAnonymized = false, isSpeaking = true } = options
  const colors = isAnonymized ? ANONYMIZED_COLORS : OPEN_COLORS
  const gradient = context.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, colors.from)
  gradient.addColorStop(1, colors.to)
  context.fillStyle = gradient
  context.fillRect(0, 0, width, height)

  const centerX = width / 2 + Math.sin(timeMs / 900) * width * 0.014
  const headY = height * 0.42
  context.fillStyle = colors.figure
  context.beginPath()
  context.ellipse(centerX, headY, height * 0.15, height * 0.18, 0, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.ellipse(centerX, height, width * 0.23, height * 0.3, 0, 0, Math.PI * 2)
  context.fill()

  if (!isAnonymized && isSpeaking) {
    const mouthOpen = Math.abs(Math.sin(timeMs / 140)) * height * 0.02
    context.fillStyle = colors.text
    context.beginPath()
    context.ellipse(centerX, headY + height * 0.08, height * 0.03, mouthOpen + 1, 0, 0, Math.PI * 2)
    context.fill()
  }

  context.fillStyle = colors.text
  context.font = `600 ${Math.round(height * 0.042)}px system-ui, sans-serif`
  context.textAlign = 'center'
  context.fillText(label, width / 2, height * 0.1)
}
