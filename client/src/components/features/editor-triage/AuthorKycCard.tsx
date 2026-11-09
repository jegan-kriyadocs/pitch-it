import { CircleCheck, CircleX, Fingerprint, TriangleAlert, type LucideIcon } from 'lucide-react'
import { useState } from 'react'

import type { IntegrityCheckStatus, RiskLevel, TriageSubmission } from '@/types/editorTriage'
import { Badge } from '@/ui/Badge'
import { CheckboxField } from '@/ui/CheckboxField'
import { ProgressBar } from '@/ui/ProgressBar'
import { SectionCard } from '@/ui/SectionCard'
import { getKycBadge } from './editorTriageRules'

const CHECK_ICONS: Record<IntegrityCheckStatus, { icon: LucideIcon; className: string; label: string }> = {
  pass: { icon: CircleCheck, className: 'text-emerald-600', label: 'Passed' },
  warn: { icon: TriangleAlert, className: 'text-amber-600', label: 'Warning' },
  fail: { icon: CircleX, className: 'text-red-600', label: 'Failed' },
}

const RISK_TONES: Record<RiskLevel, 'success' | 'warning' | 'danger'> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
}

interface AuthorKycCardProps {
  submission: TriageSubmission
}

export function AuthorKycCard({ submission }: AuthorKycCardProps) {
  const [isPresenterConfirmed, setIsPresenterConfirmed] = useState(false)
  const { author, integrityChecks, riskScore, riskLevel } = submission
  const kycBadge = getKycBadge(submission.kycStatus)
  const stats = [
    { label: 'Publications', value: author.publicationCount },
    { label: 'h-index', value: author.hIndex },
    { label: 'Co-authors', value: author.coAuthorCount },
  ]

  return (
    <SectionCard
      title="Author identity (KYC)"
      icon={Fingerprint}
      actions={<Badge variant={kycBadge.variant}>{kycBadge.label}</Badge>}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-heading">{author.displayName}</span>
        <span className="text-[13px] text-body">{author.affiliation}</span>
        <span className="font-mono text-xs text-muted">ORCID {author.orcid}</span>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-center">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-base bg-gray-50 px-2 py-2">
            <dt className="text-[11px] text-muted">{stat.label}</dt>
            <dd className="text-base font-semibold text-heading">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-heading">Paper mill integrity risk</span>
          <span className="text-body tabular-nums">{riskScore} / 100</span>
        </div>
        <ProgressBar label="Paper mill integrity risk" value={riskScore} tone={RISK_TONES[riskLevel]} valueText={`${riskScore} out of 100, ${riskLevel} risk`} />
      </div>

      <ul className="flex flex-col gap-2">
        {integrityChecks.map((check) => {
          const { icon: Icon, className, label } = CHECK_ICONS[check.status]
          return (
            <li key={check.label} className="flex gap-2 text-[13px]">
              <Icon size={15} aria-label={label} className={`mt-px shrink-0 ${className}`} />
              <span>
                <span className="font-medium text-heading">{check.label}: </span>
                <span className="text-body">{check.detail}</span>
              </span>
            </li>
          )
        })}
      </ul>

      <CheckboxField
        label="Presenter on camera matches the corresponding author"
        description={isPresenterConfirmed ? 'Confirmed by you.' : 'Compare the video with the author’s ORCID profile.'}
        isChecked={isPresenterConfirmed}
        isDisabled={submission.pitch.status !== 'ready'}
        onChange={setIsPresenterConfirmed}
        className="rounded-base border border-border p-3"
      />
    </SectionCard>
  )
}
