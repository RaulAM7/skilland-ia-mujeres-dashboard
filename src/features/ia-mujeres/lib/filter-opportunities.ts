import type { IaMujeresDashboardSnapshot } from '../types/dashboard-snapshot'

export type OpportunityFilters = {
  search: string
  stageKey: string
  technicalOutcome: string
}

export function filterOpportunities(
  opportunities: IaMujeresDashboardSnapshot['opportunities'],
  filters: OpportunityFilters,
) {
  const search = normalize(filters.search)

  return opportunities
    .filter((opportunity) => {
      if (filters.stageKey !== 'all' && opportunity.commercialStage !== filters.stageKey) {
        return false
      }

      const technicalOutcome = opportunity.technicalEmailOutcome ?? 'unknown'
      if (filters.technicalOutcome !== 'all' && technicalOutcome !== filters.technicalOutcome) {
        return false
      }

      if (!search) {
        return true
      }

      return normalize(
        [
          opportunity.name,
          opportunity.companyName,
          opportunity.commercialStageLabel,
          opportunity.nextActionLabel,
          opportunity.icp,
          opportunity.entityType,
          opportunity.owner,
        ]
          .filter(Boolean)
          .join(' '),
      ).includes(search)
    })
    .sort(compareOpportunities)
}

function normalize(value: string | undefined) {
  return value?.trim().toLowerCase() ?? ''
}

function compareOpportunities(
  left: IaMujeresDashboardSnapshot['opportunities'][number],
  right: IaMujeresDashboardSnapshot['opportunities'][number],
) {
  return compareDates(left.nextActionAt, right.nextActionAt) || getOpportunityLabel(left).localeCompare(getOpportunityLabel(right))
}

function compareDates(left: string | undefined, right: string | undefined) {
  if (left && right) {
    return new Date(left).getTime() - new Date(right).getTime()
  }

  if (left) return -1
  if (right) return 1
  return 0
}

function getOpportunityLabel(opportunity: IaMujeresDashboardSnapshot['opportunities'][number]) {
  return opportunity.companyName ?? opportunity.name
}
