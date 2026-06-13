import { describe, expect, it } from 'vitest'
import { getRelatedTasksForOpportunity } from '../src/features/ia-mujeres/lib/opportunity-related-tasks'
import type { DashboardOpportunity, DashboardTask } from '../src/features/ia-mujeres/types/dashboard-snapshot'

describe('getRelatedTasksForOpportunity', () => {
  it('matches related tasks by opportunity id and entity name, sorted by urgency', () => {
    const opportunity: DashboardOpportunity = {
      id: 'opp-1',
      name: 'Camara Comercio Demo',
      companyName: 'Camara Comercio Demo',
      commercialStage: 'EMAIL_1_SENT',
      commercialStageLabel: 'Email 1 enviado',
      technicalEmailOutcome: 'sent_without_bounce',
    }

    const tasks: DashboardTask[] = [
      {
        id: 'task-2',
        title: 'Tarea abierta',
        status: 'open',
        dueAt: '2026-06-13T10:00:00.000Z',
        relatedCompany: {
          id: 'co-1',
          name: 'Camara Comercio Demo',
        },
      },
      {
        id: 'task-1',
        title: 'Tarea vencida',
        status: 'overdue',
        dueAt: '2026-06-12T10:00:00.000Z',
        relatedOpportunity: {
          id: 'opp-1',
          name: 'Camara Comercio Demo',
        },
      },
      {
        id: 'task-3',
        title: 'Otra entidad',
        status: 'open',
        relatedCompany: {
          id: 'co-2',
          name: 'Fundacion Demo',
        },
      },
    ]

    expect(getRelatedTasksForOpportunity(tasks, opportunity).map((task) => task.id)).toEqual(['task-1', 'task-2'])
  })
})
