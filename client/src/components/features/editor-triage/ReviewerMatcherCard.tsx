import { CircleCheck, Send, Users } from 'lucide-react'

import { showToast } from '@/lib/toastStore'
import type { TriageSubmission } from '@/types/editorTriage'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { SectionCard } from '@/ui/SectionCard'
import { useEditorTriageStore } from './editorTriageStore'

interface ReviewerMatcherCardProps {
  submission: TriageSubmission
}

export function ReviewerMatcherCard({ submission }: ReviewerMatcherCardProps) {
  const inviteReviewer = useEditorTriageStore((state) => state.inviteReviewer)
  const canInvite = submission.decision === 'accepted_for_review'

  function invite(reviewerId: string, reviewerName: string) {
    inviteReviewer(submission.manuscriptId, reviewerId)
    showToast({
      variant: 'success',
      title: `Invitation sent to ${reviewerName}`,
      description: `${submission.manuscriptId} · they'll get the pitch and manuscript.`,
    })
  }

  return (
    <SectionCard
      title="Suggested reviewers"
      icon={Users}
      description={
        canInvite
          ? 'Matched to topics spoken in the pitch. Invite with one click.'
          : 'Accept the manuscript for review to send invitations.'
      }
    >
      <ul className="flex flex-col gap-2">
        {submission.reviewers.map((reviewer) => {
          const isInvited = submission.invitedReviewerIds.includes(reviewer.id)
          return (
            <li key={reviewer.id} className="flex flex-wrap items-center gap-3 rounded-base border border-border p-3">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold text-heading">{reviewer.name}</span>
                <span className="text-[13px] text-body">{reviewer.expertise}</span>
                <div className="flex gap-1.5">
                  <Badge size="xs" variant="brand">
                    {reviewer.matchPercent}% match
                  </Badge>
                  {!reviewer.isAvailable && (
                    <Badge size="xs" variant="neutral">
                      Unavailable
                    </Badge>
                  )}
                </div>
              </div>
              {isInvited ? (
                <Badge variant="success">
                  <CircleCheck size={13} aria-hidden />
                  Invited
                </Badge>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!canInvite || !reviewer.isAvailable}
                  onClick={() => invite(reviewer.id, reviewer.name)}
                  aria-label={`Invite ${reviewer.name}`}
                >
                  <Send aria-hidden />
                  Invite
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </SectionCard>
  )
}
