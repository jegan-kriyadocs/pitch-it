import { ShieldCheck, ShieldOff, Timer } from 'lucide-react'

import { formatDurationLabel } from '@/lib/formatTime'
import type { ManuscriptSession } from '@/types/authorStudio'
import { Badge } from '@/ui/Badge'
import { Card } from '@/ui/Card'

interface HeaderContextBarProps {
  session: ManuscriptSession
}

export function HeaderContextBar({ session }: HeaderContextBarProps) {
  const isDoubleBlind = session.reviewPolicy === 'double_blind'

  return (
    <Card className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
          <span className="font-semibold text-brand-700">{session.journalName}</span>
          <span aria-hidden>·</span>
          <span>{session.manuscriptId}</span>
          <span aria-hidden>·</span>
          <span>DOI preview {session.doiPreview}</span>
        </div>
        <h1 className="text-xl leading-snug font-semibold text-heading sm:text-2xl">
          {session.shortTitle}
        </h1>
        <p className="text-sm text-body">
          Record a 2–3 minute pitch that explains why this manuscript deserves peer review.
        </p>
      </div>
      <div className="flex flex-col items-start gap-2 lg:items-end">
        {isDoubleBlind ? (
          <Badge variant="brand">
            <ShieldCheck size={13} aria-hidden />
            Double-blind review: face and voice are shielded for reviewers
          </Badge>
        ) : (
          <Badge variant="success">
            <ShieldOff size={13} aria-hidden />
            Open review: reviewers see your credentials
          </Badge>
        )}
        <Badge variant="neutral">
          <Timer size={13} aria-hidden />
          Target {formatDurationLabel(session.targetDurationSeconds)} (max{' '}
          {formatDurationLabel(session.maxDurationSeconds)})
        </Badge>
      </div>
    </Card>
  )
}
