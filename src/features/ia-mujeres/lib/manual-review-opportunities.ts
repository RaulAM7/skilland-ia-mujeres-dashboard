import type { DashboardOpportunity } from '../types/dashboard-snapshot'

export function getManualReviewOpportunities(opportunities: DashboardOpportunity[]) {
  return opportunities.filter(needsManualReview).sort(compareManualReviewOpportunities)
}

function needsManualReview(opportunity: DashboardOpportunity) {
  return (
    opportunity.commercialStage === 'WRONG_CONTACT_MANUAL_REVIEW' ||
    opportunity.technicalEmailOutcome === 'manual_review' ||
    opportunity.technicalEmailOutcome === 'bounced'
  )
}

function compareManualReviewOpportunities(left: DashboardOpportunity, right: DashboardOpportunity) {
  return (
    comparePriority(left, right) ||
    compareDates(left.nextActionAt, right.nextActionAt) ||
    getOpportunityLabel(left).localeCompare(getOpportunityLabel(right))
  )
}

function comparePriority(left: DashboardOpportunity, right: DashboardOpportunity) {
  return getPriority(left) - getPriority(right)
}

function getPriority(opportunity: DashboardOpportunity) {
  if (opportunity.technicalEmailOutcome === 'bounced') return 0
  if (opportunity.technicalEmailOutcome === 'manual_review') return 1
  if (opportunity.commercialStage === 'WRONG_CONTACT_MANUAL_REVIEW') return 2
  return 3
}

function compareDates(left: string | undefined, right: string | undefined) {
  if (left && right) {
    return new Date(left).getTime() - new Date(right).getTime()
  }

  if (left) return -1
  if (right) return 1
  return 0
}

function getOpportunityLabel(opportunity: DashboardOpportunity) {
  return opportunity.companyName ?? opportunity.name
}
