import type { DashboardOpportunity, DashboardTask } from '../types/dashboard-snapshot'
import { getFunnelHref } from './funnel-route-filter'

export function getOpportunityFunnelHref(opportunity: DashboardOpportunity) {
  return getFunnelHref({
    search: opportunity.companyName ?? opportunity.name,
    stageKey: opportunity.commercialStage,
    technicalOutcome: opportunity.technicalEmailOutcome ?? 'all',
  })
}

export function getTaskRelatedEntityHref(task: DashboardTask) {
  const entityName = task.relatedCompany?.name ?? task.relatedOpportunity?.name

  if (!entityName) {
    return undefined
  }

  return getFunnelHref({
    search: entityName,
    stageKey: 'all',
    technicalOutcome: 'all',
  })
}
