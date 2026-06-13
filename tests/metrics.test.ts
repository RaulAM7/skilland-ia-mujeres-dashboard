import { describe, expect, it } from 'vitest'
import { buildTotals } from '../server/ia-mujeres/metrics'
import type { DashboardOpportunity, DashboardTask } from '../src/features/ia-mujeres/types/dashboard-snapshot'

describe('buildTotals', () => {
  it('computes opportunity metrics from commercial stage and technical outcome', () => {
    const opportunities: DashboardOpportunity[] = [
      createOpportunity({
        id: 'opp-1',
        commercialStage: 'NOT_SENT',
        technicalEmailOutcome: 'not_attempted',
      }),
      createOpportunity({
        id: 'opp-2',
        commercialStage: 'DRAFT_CREATED',
        technicalEmailOutcome: 'not_attempted',
      }),
      createOpportunity({
        id: 'opp-3',
        commercialStage: 'EMAIL_1_SENT',
        technicalEmailOutcome: 'sent_without_bounce',
      }),
      createOpportunity({
        id: 'opp-4',
        commercialStage: 'MEETING_PROPOSED',
        technicalEmailOutcome: 'sent_without_bounce',
      }),
      createOpportunity({
        id: 'opp-5',
        commercialStage: 'WRONG_CONTACT_MANUAL_REVIEW',
        technicalEmailOutcome: 'manual_review',
      }),
      createOpportunity({
        id: 'opp-6',
        commercialStage: 'REPLY_RECEIVED',
        technicalEmailOutcome: 'sent_without_bounce',
      }),
      createOpportunity({
        id: 'opp-7',
        commercialStage: 'MEETING_SCHEDULED',
        technicalEmailOutcome: 'bounced',
      }),
    ]

    const totals = buildTotals(opportunities, [])

    expect(totals).toMatchObject({
      opportunities: 7,
      companies: 7,
      notSent: 1,
      draftCreated: 1,
      outreachAttempts: 5,
      email1Sent: 1,
      sentWithoutBounce: 3,
      bouncesDetected: 1,
      repliesDetected: 1,
      meetingProposed: 1,
      meetingScheduled: 1,
      manualReview: 1,
    })
  })

  it('computes task metrics including overdue, due today and followups', () => {
    const tasks: DashboardTask[] = [
      createTask({
        id: 'task-1',
        status: 'overdue',
        category: 'followup',
        dueAt: todayIsoAtHour(9),
      }),
      createTask({
        id: 'task-2',
        status: 'open',
        category: 'followup',
        dueAt: todayIsoAtHour(14),
      }),
      createTask({
        id: 'task-3',
        status: 'done',
        category: 'manual_review',
      }),
      createTask({
        id: 'task-4',
        status: 'open',
        category: 'data_quality',
      }),
    ]

    const totals = buildTotals([], tasks)

    expect(totals).toMatchObject({
      openTasks: 3,
      overdueTasks: 1,
      dueTodayTasks: 2,
      followupsPending: 2,
    })
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

function createTask(overrides: Partial<DashboardTask> & Pick<DashboardTask, 'id'>): DashboardTask {
  return {
    id: overrides.id,
    title: overrides.title ?? overrides.id,
    status: overrides.status ?? 'open',
    dueAt: overrides.dueAt,
    owner: overrides.owner,
    category: overrides.category,
    relatedOpportunity: overrides.relatedOpportunity,
    relatedCompany: overrides.relatedCompany,
  }
}

function todayIsoAtHour(hour: number) {
  const date = new Date()
  date.setUTCHours(hour, 0, 0, 0)
  return date.toISOString()
}
