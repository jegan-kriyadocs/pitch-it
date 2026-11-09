import { PLAYBACK_RATES } from '@/lib/timeline'
import { SelectField } from '@/ui/SelectField'

const RATE_OPTIONS = PLAYBACK_RATES.map((rate) => ({ value: String(rate), label: `${rate}×` }))

interface PlaybackRateSelectProps {
  value: number
  onChange: (rate: number) => void
}

export function PlaybackRateSelect({ value, onChange }: PlaybackRateSelectProps) {
  return (
    <SelectField
      label="Speed"
      options={RATE_OPTIONS}
      value={String(value)}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  )
}
