import { describe, expect, it } from 'vitest'
import {
  DEFAULT_TWENTY_IA_MUJERES_MAPPING,
  TWENTY_MAPPING_RUNTIME_STATUS,
} from '../server/crm/twenty-ia-mujeres-mapping'

describe('twenty IA Mujeres mapping', () => {
  it('keeps IA Mujeres source-confirmed fields centralized', () => {
    expect(DEFAULT_TWENTY_IA_MUJERES_MAPPING.stageFieldCandidates).toContain('iaMujeresFunnelStage')
    expect(DEFAULT_TWENTY_IA_MUJERES_MAPPING.outreachStatusFieldCandidates).toContain('outreachStatus')
    expect(DEFAULT_TWENTY_IA_MUJERES_MAPPING.followupDueAtFieldCandidates).toContain('followUpDueAt')
    expect(DEFAULT_TWENTY_IA_MUJERES_MAPPING.lastEmailEventTypeFieldCandidates).toContain('lastEmailEventType')
    expect(DEFAULT_TWENTY_IA_MUJERES_MAPPING.manualReviewFieldCandidates).toContain('needsManualReview')
    expect(TWENTY_MAPPING_RUNTIME_STATUS.status).toBe('runtime-unverified')
  })

  it('defines object names for the read-only adapter', () => {
    expect(DEFAULT_TWENTY_IA_MUJERES_MAPPING.opportunityObjectName).toBeTruthy()
    expect(DEFAULT_TWENTY_IA_MUJERES_MAPPING.taskObjectName).toBeTruthy()
    expect(DEFAULT_TWENTY_IA_MUJERES_MAPPING.companyObjectName).toBeTruthy()
    expect(DEFAULT_TWENTY_IA_MUJERES_MAPPING.personObjectName).toBeTruthy()
  })
})
