import type { DashboardOpportunity } from '../../src/features/ia-mujeres/types/dashboard-snapshot'
import type { RawIaMujeresOpportunity } from '../crm/ia-mujeres-crm-repository'
import { getStageDefinition } from './stage-mapping'

export function normalizeOpportunity(raw: RawIaMujeresOpportunity): DashboardOpportunity {
  const commercialStage = raw.commercialStage ?? raw.iaMujeresFunnelStage ?? 'UNKNOWN_STAGE'
  const stage = getStageDefinition(commercialStage)

  return {
    id: raw.id,
    name: raw.name ?? raw.companyName ?? 'Oportunidad sin nombre',
    companyName: raw.companyName ?? raw.name,
    commercialStage: stage.key,
    commercialStageLabel: raw.commercialStageLabel ?? stage.label,
    outreachStatus: raw.outreachStatus,
    technicalEmailOutcome:
      raw.technicalEmailOutcome ??
      inferTechnicalEmailOutcome(raw.lastEmailEventType, raw.needsManualReview, raw.firstEmailSentAt),
    owner: raw.owner,
    lastContactAt: raw.lastContactAt ?? raw.lastEmailSentAt ?? raw.firstEmailSentAt,
    nextActionAt: raw.nextActionAt ?? raw.followUpDueAt,
    nextActionLabel: raw.nextActionLabel,
    manualReviewReason: raw.manualReviewReason,
    territory: raw.territory,
    entityType: raw.entityType,
    icp: raw.icp,
  }
}

function inferTechnicalEmailOutcome(
  eventType: string | undefined,
  needsManualReview: boolean | undefined,
  firstEmailSentAt: string | undefined,
): DashboardOpportunity['technicalEmailOutcome'] {
  if (needsManualReview) return 'manual_review'
  if (eventType?.toLowerCase().includes('bounce')) return 'bounced'
  if (firstEmailSentAt) return 'sent_without_bounce'
  return 'not_attempted'
}
