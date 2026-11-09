interface CountdownOverlayProps {
  remainingSeconds: number | null
}

export function CountdownOverlay({ remainingSeconds }: CountdownOverlayProps) {
  if (remainingSeconds === null || remainingSeconds <= 0) {
    return null
  }

  return (
    <div
      role="status"
      aria-live="assertive"
      className="absolute inset-0 flex items-center justify-center bg-gray-900/50 text-7xl font-bold text-white"
    >
      {remainingSeconds}
    </div>
  )
}
