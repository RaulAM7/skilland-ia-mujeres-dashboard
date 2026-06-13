import { describe, expect, it } from 'vitest'
import { getManualReviewOpportunities } from '../src/features/ia-mujeres/lib/manual-review-opportunities'
import type { DashboardOpportunity } from '../src/features/ia-mujeres/types/dashboard-snapshot'

describe('getManualReviewOpportunities', () => {
  it('returns only bounced or manual review opportunities sorted by urgency', () => {
    const opportunities: DashboardOpportunity[] = [
      createOpportunity({
        id: 'not-sent',
        commercialStage: 'NOT_SENT',
        technicalEmailOutcome: 'not_attempted',
      }),
      createOpportunity({
        id: 'manual-later',
        commercialStage: 'WRONG_CONTACT_MANUAL_REVIEW',
        technicalEmailOutcome: 'manual_review',
        nextActionAt: '2026-06-14T10:00:00.000Z',
      }),
      createOpportunity({
        id: 'bounce-earlier',
        commercialStage: 'EMAIL_1_SENT',
        technicalEmailOutcome: 'bounced',
        nextActionAt: '2026-06-12T09:00:00.000Z',
      }),
      createOpportunity({
        id: 'bounce-later',
        commercialStage: 'EMAIL_1_SENT',
        technicalEmailOutcome: 'bounced',
        nextActionAt: '2026-06-13T09:00:00.000Z',
      }),
    ]

    expect(getManualReviewOpportunities(opportunities).map((opportunity) => opportunity.id)).toEqual([
      'bounce-earlier',
      'bounce-later',
      'manual-later',
    ])
  })
})

function createOpportunity(overrides: Partial<DashboardOpportunity> & Pick<DashboardOpportunity, 'id'>): DashboardOpportunity {
  return {
    id: overrides.id,
    name: overrides.name ?? overrides.id,
    companyName: overrides.companyName ?? overrides.id,
    commercialStage: overrides.commercialStage ?? 'NOT_SENT',
    commercialStageLabel: overrides.commercialStageLabel ?? overrides.commercialStage ?? 'NOT_SENT',
    technicalEmailOutcome: overrides.technicalEmailOutcome ?? 'not_attempted',
    outreachStatus: overrides.outreachStatus,
    owner: overrides.owner,
    lastContactAt: overrides.lastContactAt,
    nextActionAt: overrides.nextActionAt,
    nextActionLabel: overrides.nextActionLabel,
    manualReviewReason: overrides.manualReviewReason,
    territory: overrides.territory,
    entityType: overrides.entityType,
    icp: overrides.icp,
  }
}
