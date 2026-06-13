import { describe, expect, it } from 'vitest'
import { getOpportunityFunnelHref, getTaskRelatedEntityHref } from '../src/features/ia-mujeres/lib/entity-links'
import type { DashboardOpportunity, DashboardTask } from '../src/features/ia-mujeres/types/dashboard-snapshot'

describe('entity links', () => {
  it('builds a funnel href for a manual review opportunity', () => {
    const opportunity: DashboardOpportunity = {
      id: 'opp-1',
      name: 'Fundacion Demo',
      companyName: 'Fundacion Demo',
      commercialStage: 'WRONG_CONTACT_MANUAL_REVIEW',
      commercialStageLabel: 'Revision manual por contacto',
      technicalEmailOutcome: 'manual_review',
    }

    expect(getOpportunityFunnelHref(opportunity)).toBe(
      '/ia-mujeres/funnel?q=Fundacion+Demo&stage=WRONG_CONTACT_MANUAL_REVIEW&outcome=manual_review',
    )
  })

  it('builds a search-only funnel href for a related task entity', () => {
    const task: DashboardTask = {
      id: 'task-1',
      title: 'Revisar entidad',
      status: 'open',
      relatedCompany: {
        id: 'co-1',
        name: 'Cabildo Demo',
      },
    }

    expect(getTaskRelatedEntityHref(task)).toBe('/ia-mujeres/funnel?q=Cabildo+Demo')
  })

  it('returns undefined when the task has no related entity', () => {
    expect(
      getTaskRelatedEntityHref({
        id: 'task-2',
        title: 'Sin relacion',
        status: 'open',
      }),
    ).toBeUndefined()
  })
})
