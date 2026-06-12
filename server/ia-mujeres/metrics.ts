import type {
  DashboardOpportunity,
  DashboardTask,
  IaMujeresDashboardSnapshot,
} from '../../src/features/ia-mujeres/types/dashboard-snapshot'
import { getStageDefinition } from './stage-mapping'

export type SnapshotTotals = IaMujeresDashboardSnapshot['totals']

export function buildTotals(opportunities: DashboardOpportunity[], tasks: DashboardTask[]): SnapshotTotals {
  return {
    opportunities: opportunities.length,
    companies: new Set(opportunities.map((opportunity) => opportunity.companyName ?? opportunity.name)).size,
    people: 0,
    notSent: countStage(opportunities, 'NOT_SENT'),
    draftCreated: countStage(opportunities, 'DRAFT_CREATED'),
    outreachAttempts: opportunities.filter((opportunity) => opportunity.technicalEmailOutcome !== 'not_attempted').length,
    email1Sent: countStage(opportunities, 'EMAIL_1_SENT'),
    sentWithoutBounce: opportunities.filter((opportunity) => opportunity.technicalEmailOutcome === 'sent_without_bounce').length,
    bouncesDetected: opportunities.filter((opportunity) => opportunity.technicalEmailOutcome === 'bounced').length,
    repliesDetected: countStage(opportunities, 'REPLY_RECEIVED'),
    meetingProposed: countStage(opportunities, 'MEETING_PROPOSED'),
    meetingScheduled: countStage(opportunities, 'MEETING_SCHEDULED'),
    manualReview: opportunities.filter(
      (opportunity) =>
        opportunity.commercialStage === 'WRONG_CONTACT_MANUAL_REVIEW' ||
        opportunity.technicalEmailOutcome === 'manual_review',
    ).length,
    openTasks: tasks.filter((task) => task.status !== 'done').length,
    overdueTasks: tasks.filter((task) => task.status === 'overdue').length,
    dueTodayTasks: tasks.filter((task) => isDueToday(task.dueAt)).length,
    followupsPending: tasks.filter((task) => task.category === 'followup' && task.status !== 'done').length,
  }
}

export function buildFunnelStages(opportunities: DashboardOpportunity[]): IaMujeresDashboardSnapshot['funnelStages'] {
  const total = opportunities.length || 1
  const counts = new Map<string, number>()

  for (const opportunity of opportunities) {
    counts.set(opportunity.commercialStage, (counts.get(opportunity.commercialStage) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([stageKey, count]) => {
      const definition = getStageDefinition(stageKey)
      return {
        key: definition.key,
        label: definition.label,
        count,
        percentage: Math.round((count / total) * 100),
        order: definition.order,
        semantic: definition.semantic,
      }
    })
    .sort((a, b) => a.order - b.order)
}

function countStage(opportunities: DashboardOpportunity[], stage: string) {
  return opportunities.filter((opportunity) => opportunity.commercialStage === stage).length
}

function isDueToday(dueAt: string | undefined) {
  if (!dueAt) return false
  const due = new Date(dueAt)
  const now = new Date()
  return (
    due.getUTCFullYear() === now.getUTCFullYear() &&
    due.getUTCMonth() === now.getUTCMonth() &&
    due.getUTCDate() === now.getUTCDate()
  )
}
